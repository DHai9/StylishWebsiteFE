import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import optionApi from "./services/option-api";

export const OPTION = "/optionSlice";
export const GET_OPTION = "/option/get_list";
export const GET_OPTION_ROOT = "/option/get_list/root";
export const GET_OPTION_PROPERTY = "/option/get_list/property";
export const GET_OPTION_BY_TYPE = "/option/get_list/type";
export const ADD_OPTION = "/option/add_option";
export const GET_DETAIL = "/option/get_details";
export const UPDATE_OPTION = "/option/update_option";
export const SET_OPTION_UPDATE = "/option/set_option_update";

export const getListOption = createAsyncThunk(GET_OPTION, async () => {
  try {
    const response = await optionApi.getListOption();
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err.response;
    }
  }
});

export const addNewOption = createAsyncThunk(
  ADD_OPTION,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await optionApi.addOption(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const updateOption = createAsyncThunk(
  UPDATE_OPTION,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await optionApi.updateOption(payload.Id, payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getOptionDetails = createAsyncThunk(
  GET_OPTION,
  async (obj, { rejectWithValue }) => {
    try {
      const response = await optionApi.getOptionDetails(obj.id, obj.key);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const getOptionRoot = createAsyncThunk(GET_OPTION_ROOT, async () => {
  try {
    const response = await optionApi.getListOptionByType(0);
    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
  }
});

export const getOptionProperty = createAsyncThunk(
  GET_OPTION_PROPERTY,
  async () => {
    try {
      const response = await optionApi.getListOptionByType(1);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
    }
  }
);

export const getOptionByType = createAsyncThunk(
  GET_OPTION_BY_TYPE,
  async (type) => {
    try {
      const response = await optionApi.getListOptionByType(type);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
    }
  }
);

export const setOptionUpdate = createAsyncThunk(
  SET_OPTION_UPDATE,
  async (payload) => {
    try {
      return payload;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
    }
  }
);

const initialState = {
  options: [],
  optionRoot: [],
  optionProperties: [],
  optionByType: [],
  option_detail: {},
  option_update: {},
  option_new: {},
  error: false,
  loadding: false,
};
const optionSlice = createSlice({
  name: OPTION,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* Register */
    builder
      .addCase(getListOption.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getListOption.fulfilled, (state, { payload }) => {
        state.options = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getListOption.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(addNewOption.pending, (state) => {
        state.loadding = true;
      })
      .addCase(addNewOption.fulfilled, (state, { payload }) => {
        state.option_new = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(addNewOption.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(updateOption.pending, (state) => {
        state.loadding = true;
      })
      .addCase(updateOption.fulfilled, (state, { payload }) => {
        let data = payload.Payload;
        state.option_update = data;
        let newOptions = state.options.filter(e => e.Id !== data.Id);
        state.options = [...newOptions, data]
        state.loadding = false;
        state.error = null;
      })
      .addCase(updateOption.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(getOptionByType.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getOptionByType.fulfilled, (state, { payload }) => {
        state.optionByType = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getOptionByType.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(getOptionRoot.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getOptionRoot.fulfilled, (state, { payload }) => {
        state.optionRoot = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getOptionRoot.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(getOptionProperty.pending, (state) => {
        state.loadding = true;
      })
      .addCase(getOptionProperty.fulfilled, (state, { payload }) => {
        state.optionProperties = payload.Payload;
        state.loadding = false;
        state.error = null;
      })
      .addCase(getOptionProperty.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(setOptionUpdate.fulfilled, (state, { payload }) => {
        state.option_update = payload;
        state.loadding = false;
        state.error = null;
      });
  },
});

const { reducer, actions } = optionSlice;
export const selectOption = (state) => state.option;

export default reducer;
export const { increment, decrement } = actions;
