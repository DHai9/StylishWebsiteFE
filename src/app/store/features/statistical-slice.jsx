import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import statisticalApi from "./services/statistical-api";

export const STATISTICAL = "statisticalSlice";
export const GET_STATISTICAL_PRODUCT_BESTSALLER =
  "statistical/gets_productbestsaller";
export const GET_STATISTICAL_PRODUCT_BESTSALLER_ORDER =
  "statistical/gets_productbestsaller_order";
export const GET_STATISTICAL_USER =
  "statistical/get_user";

export const getProductStatistical = createAsyncThunk(
  GET_STATISTICAL_PRODUCT_BESTSALLER,
  async (query, { rejectWithValue }) => {
    try {
      const response = await statisticalApi.getProductStatistical(query);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getUserStatistical = createAsyncThunk(
  GET_STATISTICAL_USER,
  async (query, { rejectWithValue }) => {
    try {
      const response = await statisticalApi.getUserStatistical(query);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getProductBestsaller = createAsyncThunk(
  GET_STATISTICAL_PRODUCT_BESTSALLER_ORDER,
  async (options, { rejectWithValue }) => {
    try {
      const response = await statisticalApi.getProductBestsaller(options);
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
  statisticals: [],
  statisticalOrders: [],
  statisticalUser: [],
  error: false,
  loadding: null,
  statisticalOrdersError: null,
  statisticalOrdersLoadding: false,
};
const StatisticalSlice = createSlice({
  name: STATISTICAL,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* Register */
    builder
      .addCase(getProductBestsaller.pending, (state) => {
        state.statisticalOrdersLoadding = true;
      })
      .addCase(getProductBestsaller.fulfilled, (state, { payload }) => {
        state.statisticalOrders = payload.Payload;
        state.statisticalOrdersLoadding = false;
        state.statisticalOrdersError = null;
      })
      .addCase(getProductBestsaller.rejected, (state, { payload }) => {
        state.statisticalOrdersError = payload.Payload;
      })
      .addCase(getUserStatistical.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getUserStatistical.fulfilled, (state, { payload }) => {
        state.statisticalUser = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getUserStatistical.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(getProductStatistical.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getProductStatistical.fulfilled, (state, { payload }) => {
        state.statisticals = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getProductStatistical.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      });
  },
});

const { reducer, actions } = StatisticalSlice;
export const selectStatistical = (state) => state.statisticals;

export default reducer;
export const { increment, decrement } = actions;
