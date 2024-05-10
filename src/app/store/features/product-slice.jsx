import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productApi from "./services/product-api";

export const PRODUCT = "productSlice";
export const GET_PRODUCT = "product/gets";
export const ADD_PRODUCT = "product/add_product";
export const UPDATE_PRODUCT = "product/update";
export const GET_DETAILS = "product/detail";
export const GET_DELETE = "product/delete";
export const PRODUCT_DETAIL = "productDetail";
export const SET_IS_LOAD = "isLoad";
export const ADD_IMAGE = "product/add_image";

export const setProductDetail = createAsyncThunk(
  PRODUCT_DETAIL,
  async (detail, { rejectWithValue }) => {
    try {
      return detail;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const setIsLoad = createAsyncThunk(
  SET_IS_LOAD,
  async (isLoad, { rejectWithValue }) => {
    try {
      return isLoad;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getListProduct = createAsyncThunk(GET_PRODUCT, async (query = '') => {
  try {
    const response = await productApi.getListProduct(query);
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err.response;
    }
  }
});

export const addNewProduct = createAsyncThunk(
  ADD_PRODUCT,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await productApi.addProduct(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  UPDATE_PRODUCT,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await productApi.updateProduct(payload.Id, payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  GET_DETAILS,
  async (obj, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductDetails(obj.id);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  GET_DELETE,
  async (obj, { rejectWithValue }) => {
    try {
      const response = await productApi.deleteProduct(obj.id);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const addImageProduct = createAsyncThunk(
  ADD_IMAGE,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await productApi.addImage(payload);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response);
    }
  }
);

const initialState = {
  products: [],
  product_detail: {},
  product_new: {},
  error: false,
  loadding: false,
};
const productSlice = createSlice({
  name: PRODUCT,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* Register */
    builder
      .addCase(getListProduct.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getListProduct.fulfilled, (state, { payload }) => {
        state.products = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getListProduct.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(addNewProduct.pending, (state) => {
        state.loadding = true;
      })
      .addCase(addNewProduct.fulfilled, (state, { payload }) => {
        state.product_new = payload.Payload;
        state.products = [...state.products, payload.Payload];
        state.loadding = false;
        state.error = null;
      })
      .addCase(addNewProduct.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loadding = true;
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.product_new = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(setProductDetail.pending, (state) => {
        state.loadding = true;
      })
      .addCase(setProductDetail.fulfilled, (state, { payload }) => {
        state.product_detail = payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(setProductDetail.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(setIsLoad.pending, (state) => {
        state.loadding = true;
      })
      .addCase(setIsLoad.fulfilled, (state, { payload }) => {
        state.loadding = payload;
      })
      .addCase(setIsLoad.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loadding = true;
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.products = state.products.filter(e => e.Id !== payload.Payload.Id);
        state.loadding = false;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(addImageProduct.pending, (state) => {
        state.loadding = true;
      })
      .addCase(addImageProduct.fulfilled, (state, { payload }) => {
        state.loadding = false;
        state.error = null;
      })
      .addCase(addImageProduct.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
  },
});

const { reducer, actions } = productSlice;
export const selectProduct = (state) => state.product;

export default reducer;
export const { increment, decrement } = actions;
