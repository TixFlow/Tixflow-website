"use client";

import api from "@/config/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchUserProfile", async (_, thunkAPI) => {
  try {
    const res = await api.get("/api/auth/me");
    return res.data.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Không thể tải thông tin người dùng");
  }
});

export const loginUser = createAsyncThunk<
  { user: User; accessToken: string; refreshToken: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (formData, thunkAPI) => {
  try {
    const response = await api.post("/api/auth/login", formData);

    const { accessToken, refreshToken } = response.data.data;

    Cookies.set("accessToken", accessToken, {
      expires: 1,
      secure: true,
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: 7,
    });

    const userResponse = await api.get("/api/auth/me");

    return {
      user: userResponse.data.data,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Login failed"
    );
  }
});

export const registerUser = createAsyncThunk<
  { user: User },
  {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
  },
  { rejectValue: string }
>("auth/register", async (formData, thunkAPI) => {
  try {
    const response = await api.post("/api/auth/register", formData);
    return {
      user: response.data.data,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response.data.message || "Đăng ký thất bại"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng ký thất bại";
      })

      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Tải thông tin thất bại";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  !!state.auth.accessToken;
