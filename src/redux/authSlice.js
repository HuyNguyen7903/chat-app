import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, signup } from "../services/authAPI";

// Đăng ký tài khoản
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (data, thunkAPI) => {
    try {
      const res = await signup(data);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Đăng nhập tài khoản
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await login(email, password);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    status: "idle",
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
