import { useContext, useEffect, useState } from "react";

import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css";
import CartContext from "../../Store/cart-context";

const HeaderCartButton = (props) => {
  const [buttonIsHighlighted, setButtonIsHighlighted] = useState(false);
  const cartCtx = useContext(CartContext);

  // Desctructa ut items from cartCtx så det kan användas i useEffect
  // för att applicera classer varje gång ngt uppdateras i arrayen.
  const { items } = cartCtx;

  // Detta är till för att lägga ihop alla items som är tillagda till cart genom array.reduce
  const numberOfCartItems = items.reduce((currentNumb, item) => {
    return currentNumb + item.amount;
  }, 0);

  const btnClasses = `${classes.button} ${
    buttonIsHighlighted ? classes.bump : ""
  }`;

  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    setButtonIsHighlighted(true);

    // Eftersom animeringen på knappen endast sätts på när klassen först läggs till
    // så måste vi sätta en timeOut för att ta bort klassen så att den kan
    // läggas till igen (animeringen e 300ms så drf sätts den så)
    // Eftersom vi i btnClasses la en dependency på klasserna

    const timer = setTimeout(() => {
      setButtonIsHighlighted(false);
    }, 300);

    // Cleanup function om man hade lagt till många items snabbt  - detta för att denna kallas alltid om man returnar en funktion
    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  return (
    <>
      <button className={btnClasses} onClick={props.onClick}>
        <span className={classes.icon}>
          <CartIcon />
        </span>
        <span>Your Cart</span>
        <span className={classes.badge}>{numberOfCartItems}</span>
      </button>
    </>
  );
};

export default HeaderCartButton;
