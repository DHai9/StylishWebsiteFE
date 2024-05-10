import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./features/product-slice";
import productOptionReducer from "./features/product-option-slice";
import optionReducer from "./features/option-slice";
import userReducer from "./features/author-slice";
import cartReducer from "./features/cart-slice";
import orderReducer from "./features/order-slice";
import statisticalReducer from "./features/statistical-slice";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  productReducer: productReducer,
  productOptionReducer: productOptionReducer,
  optionReducer: optionReducer,
  userReducer: userReducer,
  cartReducer: cartReducer,
  orderReducer: orderReducer,
  statisticalReducer: statisticalReducer,
});

const store = configureStore({
  reducer: rootReducer,
  // Add middleware, enhancers, or other options here if needed
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export const RootState = store.getState;
export const AppDispatch = store.dispatch;
