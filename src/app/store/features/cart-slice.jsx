import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "./services/cart-api";

export const CART = "/cartSlice";
export const INIT_CART = "/cart/init";
export const GET_CART_BY_USER_ID = "/cart/get_by_user_id";
export const PUSH_ITEM = "/cart/push_item";
export const DELETE_ITEM = "/cart/delete_item";
export const UPDATE_ITEMS = "/cart/update_items";

export const getCartByUserId = createAsyncThunk(
  GET_CART_BY_USER_ID,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cartApi.getByUserId(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);
export const addCartItem = createAsyncThunk(
  PUSH_ITEM,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cartApi.addCartItem(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);
export const deleteCartItem = createAsyncThunk(
  DELETE_ITEM,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await cartApi.deleteItem(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  cart: null,
};

const cartSlice = createSlice({
  name: CART,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* Register */
    builder
      .addCase(getCartByUserId.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getCartByUserId.fulfilled, (state, { payload }) => {
        state.cart = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getCartByUserId.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(addCartItem.pending, (state) => {
        state.loadding = true;
      })
      .addCase(addCartItem.fulfilled, (state, { payload }) => {
        state.cart = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(deleteCartItem.pending, (state, { payload }) => {
        state.loadding = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, { payload }) => {
        state.cart = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      });
  },
});

const { reducer, actions } = cartSlice;
export const selectOption = (state) => state.option;

export default reducer;
export const { increment, decrement } = actions;
