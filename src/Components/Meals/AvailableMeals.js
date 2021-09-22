import classes from "./AvailableMeals.module.css";
import Card from "../UI/Card";
import MealItem from "../Meals/MealItem/MealItem";
import { useEffect, useState, useCallback } from "react";

const AvailableMeals = (props) => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(null);

  const fetchMealsHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://reactmovies-http-post-default-rtdb.europe-west1.firebasedatabase.app/meals.json"
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      // Eftersom firebase ger oss objekt vill vi göra om det till en array som vi sedan mapar upp.
      const responseData = await response.json();
      console.log(responseData);

      // Här gör vi transformationen
      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }
      setMeals(loadedMeals);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setHttpError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchMealsHandler();
  }, [fetchMealsHandler]);

  const mealsList = meals.map((meal) => (
    <MealItem
      id={meal.id}
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  if (isLoading) {
    return (
      <section className={classes.mealIsLoading}>
        <p>{httpError}</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.mealError}>
        <p>{httpError}</p>
      </section>
    );
  }

  return (
    <section className={classes.meals}>
      <Card>
        {mealsList}
        {isLoading && <p>Loading</p>}
      </Card>
    </section>
  );
};

export default AvailableMeals;
