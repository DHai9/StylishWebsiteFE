import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderApi from "./services/order-api";

export const ORDER = "orderSlice";
export const GET_ORDER_LIST = "order/get_list";
export const GET_ORDER_NEW = "order/get_order_new";
export const GET_ORDER_LIST_BY_USER = "order/get_list_by_user";
export const ADD_ORDER_ITEM = "order/add_item";
export const ADD_ORDER = "order/add";
export const UPDATE_ORDER = "order/update";
export const SET_ORDER_UPDATE = "order/set_order_update";
export const DELETE_ITEM = "order/delete_item";

export const getOrderList = createAsyncThunk(
  GET_ORDER_LIST,
  async (query, { rejectWithValue }) => {
    try {
      const response = await orderApi.getListOrder(query);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getOrderListByUser = createAsyncThunk(
  GET_ORDER_LIST_BY_USER,
  async (query, { rejectWithValue }) => {
    try {
      const response = await orderApi.getListOrderByUser(query);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getOrderNew = createAsyncThunk(
  GET_ORDER_NEW,
  async (user_Id, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderNew(user_Id);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const addOrder = createAsyncThunk(
  ADD_ORDER,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orderApi.addOrder(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const addOrderItem = createAsyncThunk(
  ADD_ORDER_ITEM,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orderApi.addOrder(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  UPDATE_ORDER,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrder(payload);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      throw rejectWithValue(error.response.data);
    }
  }
);

export const deleteItem = createAsyncThunk(
  DELETE_ITEM,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await orderApi.deleteItem(payload);
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      throw rejectWithValue(error.response.data);
    }
  }
);

export const setOrderUpdate = createAsyncThunk(
  SET_ORDER_UPDATE,
  async (payload, { rejectWithValue }) => {
    try {
      return payload;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      throw rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  orders: [],
  order: null,
  order_new: null,
  error: false,
  loadding: false,
  can_reload: false,
};
const orderSlice = createSlice({
  name: ORDER,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* Register */
    builder
      .addCase(getOrderList.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getOrderList.fulfilled, (state, { payload }) => {
        state.orders = payload?.Payload;
        state.loadding = false;
        state.error = null;
        state.can_reload = false;
      })
      .addCase(getOrderList.rejected, (state, { payload }) => {
        state.error = payload?.Payload;
      })
      .addCase(getOrderNew.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getOrderNew.fulfilled, (state, { payload }) => {
        if (payload?.TotalCount > 0) state.order_new = payload?.Payload[0];
        state.loadding = false;
        state.error = null;
      })
      .addCase(getOrderNew.rejected, (state, { payload }) => {
        state.error = payload?.Payload;
      })
      .addCase(addOrder.pending, (state) => {
        state.loadding = true;
      })
      .addCase(addOrder.fulfilled, (state, { payload }) => {
        state.order = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(addOrder.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(getOrderListByUser.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getOrderListByUser.fulfilled, (state, { payload }) => {
        state.orders = payload.Payload;
        state.loadding = false;
        state.can_reload = false;
        state.error = null;
      })
      .addCase(getOrderListByUser.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loadding = true;
      })
      .addCase(updateOrder.fulfilled, (state, { payload }) => {
        state.order = payload.Payload;
        let newOrders = state.orders.filter((el) => el.Id !== state.order.Id);
        state.orders = [...newOrders, payload.Payload];
        state.loadding = false;
        state.can_reload = true;
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(setOrderUpdate.fulfilled, (state, { payload }) => {
        state.order = payload;
        state.can_reload = true;
      })
      .addCase(deleteItem.fulfilled, (state, { payload }) => {
        state.order = payload?.Payload;
        let newOrders = state.orders.filter((el) => el.Id !== payload?.Payload.Id);
        state.orders = [...newOrders, payload.Payload];
        state.loadding = false;
        state.can_reload = true;
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(deleteItem.pending, (state) => {
        state.loadding = true;
      });
  },
});

const { reducer, actions } = orderSlice;
export const selectOrder = (state) => state.orders;

export default reducer;
export const { increment, decrement } = actions;
