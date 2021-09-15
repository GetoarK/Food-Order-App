import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // För att hitta samma föremål i carten (enligt logiken i recudern kmr det aldrig bli mer än 1 unik)
    // i listan som displayas i cart
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // Nu har vi "plockat ut" det item som är likadant utifrån hittat index tex action.item.id === Sushi
    const existingCartItem = state.items[existingCartItemIndex];

    // Skapa en ny array som kommer ersätta dåvarande items
    let updatedItems;

    // Om Sushi redan finns -> spreada ut alla nycklar men assigna nya amount till
    // den gamla amount (gamla amount + precis tillagd amount)
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };

      // updatedItems blir en kopia av dåvarande arrayen
      updatedItems = [...state.items];

      // itemet som är på det tidigare indexet = den totala amounten av x sushi
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    // Om inte det har funnits item med samma id, så lägg bara på itemet i state.items arrayen
    else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;

    // Detta kollar om det finns existing item med bara en, och om det
    //gör det, så filtrera bort den. Annars tar vi bort 1 amount.
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({
      type: "ADD",
      item: item,
    });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({
      type: "REMOVE",
      id: id,
    });
  };

  // Jag antar att denna är låst till formatet enligt contextfilen?
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
