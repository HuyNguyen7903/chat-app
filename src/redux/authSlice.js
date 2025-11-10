import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, signup } from "../services/authAPI";

// --- Đăng ký ---
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

// --- Đăng nhập ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      // data có thể là { email, password } hoặc { phone, password }
      const identifier = data.email || data.phone;
      const res = await login(identifier, data.password);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token:
      localStorage.getItem("token") || sessionStorage.getItem("token") || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("rememberMe");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        state.status = "succeeded";
        state.error = null;

        const rememberMe = localStorage.getItem("rememberMe") === "true";

        if (rememberMe) {
          localStorage.setItem("token", action.payload.token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", action.payload.token);
          localStorage.removeItem("token");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
