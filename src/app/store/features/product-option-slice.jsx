import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ProductOptionApi from "./services/product-option-api";

export const PRODUCT_OPTION = "/productOptionSlice";
export const GET_PRODUCT_OPTION = "/productOption/list";
export const ADD_PRODUCT_OPTION = "/productOption/add";
export const GET_DETAIL = "/productOption/details";
export const UPDATE_PRODUCT_OPTION = "/productOption/update";
export const DELETE_PRODUCT_OPTION = "/productOption/delete";

export const getListProductOption = createAsyncThunk(GET_PRODUCT_OPTION, async () => {
  try {
    const response = await ProductOptionApi.getListProductOption();
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err.response;
    }
  }
});

export const addNewProductOption = createAsyncThunk(
  ADD_PRODUCT_OPTION,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ProductOptionApi.addProductOption(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const updateProductOption = createAsyncThunk(
  UPDATE_PRODUCT_OPTION,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ProductOptionApi.updateProductOption(payload.Id, payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const deleteProductOption = createAsyncThunk(
  DELETE_PRODUCT_OPTION,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ProductOptionApi.deleteProductOption(payload.id);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getproductOptionDetails = createAsyncThunk(
  GET_DETAIL,
  async (obj, { rejectWithValue }) => {
    try {
      const response = await ProductOptionApi.getDetailsProductOption(obj.id);
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
  productOptions: [],
  productOption_detail: {},
  productOption_new: {},
  error: false,
  loadding: false,
};
const productOptionSlice = createSlice({
  name: PRODUCT_OPTION,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* Register */
    builder
      .addCase(getListProductOption.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getListProductOption.fulfilled, (state, { payload }) => {
        state.productOptions = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getListProductOption.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(addNewProductOption.pending, (state) => {
        state.loadding = true;
      })
      .addCase(addNewProductOption.fulfilled, (state, { payload }) => {
        state.productOption_new = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(addNewProductOption.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(updateProductOption.pending, (state) => {
        state.loadding = true;
      })
      .addCase(updateProductOption.fulfilled, (state, { payload }) => {
        state.productOption_detail = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(updateProductOption.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(getproductOptionDetails.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getproductOptionDetails.fulfilled, (state, { payload }) => {
        state.productOption_detail = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getproductOptionDetails.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(deleteProductOption.pending, (state) => {
        state.loadding = true;
      })
      .addCase(deleteProductOption.fulfilled, (state, { payload }) => {
        state.loadding = false;
        state.error = null;
      })
      .addCase(deleteProductOption.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
  },
});

const { reducer, actions } = productOptionSlice;
export const selectProductOption = (state) => state.option;

export default reducer;
export const { increment, decrement } = actions;
