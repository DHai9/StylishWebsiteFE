import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import authorApi from "./services/author-api";

export const USER = "/userSlice";
export const INIT_USER = "/user/init";
export const REGISTER = "/users/register";
export const SIGNIN = "/users/signin";
export const SIGNOUT = "/users/signout";

export const initUserFromLocal = createAsyncThunk(INIT_USER, async () => {
  let HTTP_HTP_url_webparts = localStorage.getItem("HTTP_HTP_url_webparts");
  if (HTTP_HTP_url_webparts) {
    return JSON.parse(HTTP_HTP_url_webparts);
  } else {
    return null;
  }
});

export const register = createAsyncThunk(
  REGISTER,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authorApi.register(payload);
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const signin = createAsyncThunk(
  SIGNIN,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authorApi.signin(payload);
      localStorage.setItem(
        "HTTP_HTP_url_webparts",
        JSON.stringify(response.data.Payload)
      );
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw rejectWithValue(err.response.data);
    }
  }
);

export const signOut = createAsyncThunk(SIGNOUT, async () => {
  try {
    localStorage.removeItem("HTTP_HTP_url_webparts");
    return true;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
  }
});

const initialState = {
  user: null,
  accessToken: null,
  rule: "1",
  error: false,
  loadding: false,
};
const userSlice = createSlice({
  name: USER,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* Register */
    builder
      .addCase(register.pending, (state) => {
        state.loadding = true;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loadding = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(signin.pending, (state) => {
        state.loadding = true;
      })
      .addCase(signin.fulfilled, (state, { payload }) => {
        state.user = payload.Payload;
        state.accessToken = payload.Payload.AccessToken;
        state.loadding = false;
        state.error = null;
      })
      .addCase(signin.rejected, (state, { payload }) => {
        state.error = payload.Payload;
      })
      .addCase(initUserFromLocal.fulfilled, (state, { payload }) => {
        if (payload) {
          state.user = payload;
          state.accessToken = jwtDecode(payload.AccessToken);
          state.rule = state.accessToken.sw_numpath_property;
        }
      })
      .addCase(signOut.fulfilled, (state, { payload }) => {
        if (payload) {
          state.user = null;
          state.accessToken = null;
          state.rule = "1";
        }
      });
  },
});

const { reducer, actions } = userSlice;
export const selectOption = (state) => state.option;

export default reducer;
export const { increment, decrement } = actions;
