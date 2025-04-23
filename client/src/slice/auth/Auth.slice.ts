import { AuthService } from "@/services/Auth.service";
import { createSlice } from "@reduxjs/toolkit";
import { BasicSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "@/utils/util";
import { HttpService } from "@/services/http/HttpService";

export const loginCall: any = commonCreateAsyncThunk({
  type: "auth/login",
  action: AuthService.login,
});
export const loginGoogle: any = commonCreateAsyncThunk({
  type: "auth/loginGoogle",
  action: AuthService.loginGoogle,
});
export const loginFacebook: any = commonCreateAsyncThunk({
  type: "auth/loginFacebook",
  action: AuthService.loginFacebook,
});
export const registerCall: any = commonCreateAsyncThunk({
  type: "auth/register",
  action: AuthService.register,
});
export const verifyEmail: any = commonCreateAsyncThunk({
  type: "auth/verifyEmail",
  action: AuthService.verifyEmail,
});
interface AuthState extends BasicSliceState {
  remember: boolean;
  showUserLogin: boolean;
  showEmailVerification: boolean;
  statusRegister: "idle" | "loading" | "completed" | "failed";
  statusVerifyEmail: "idle" | "loading" | "completed" | "failed";
}
const initialState: AuthState = {
  remember: false,
  showUserLogin: false,
  showEmailVerification: false,
  status: "idle",
  statusRegister: "idle",
  statusVerifyEmail: "idle",
  error: "",
  success: "",
  action: "VIE",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
    },
    resetStatusRegister: (state) => {
      state.statusRegister = "idle";
    },
    resetStatusVerifyEmail: (state) => {
      state.statusVerifyEmail = "idle";
    },
    setShowUserLogin: (state, action) => {
      state.showUserLogin = action.payload;
    },
    setShowEmailVerification: (state, action) => {
      state.showEmailVerification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginCall.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginCall.fulfilled, (state, action) => {
        state.status = "completed";
        state.success =
          action.payload.data !== "" ? action.payload.data.message : "";
        const data = action.payload.data.data;
        localStorage.setItem("accessToken", data.tokens.accessToken);
        HttpService.setToken(data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
        HttpService.setLocalRefToken(data.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .addCase(loginCall.rejected, (state, action) => {
        state.status = "failed";
        const error = Object(action.payload);
        state.error = errorMessage(error);
      })
      .addCase(loginGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.status = "completed";
        state.success =
          action.payload.data !== "" ? action.payload.data.message : "";
        const data = action.payload.data.data;
        localStorage.setItem("accessToken", data.tokens.accessToken);
        HttpService.setToken(data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
        HttpService.setLocalRefToken(data.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        state.status = "failed";
        const error = Object(action.payload);
        state.error = errorMessage(error);
      })
      .addCase(loginFacebook.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginFacebook.fulfilled, (state, action) => {
        state.status = "completed";
        state.success =
          action.payload.data !== "" ? action.payload.data.message : "";
        const data = action.payload.data.data;
        localStorage.setItem("accessToken", data.tokens.accessToken);
        HttpService.setToken(data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
        HttpService.setLocalRefToken(data.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .addCase(loginFacebook.rejected, (state, action) => {
        state.status = "failed";
        const error = Object(action.payload);
        state.error = errorMessage(error);
      })
      .addCase(registerCall.pending, (state) => {
        state.statusRegister = "loading";
      })
      .addCase(registerCall.fulfilled, (state, action) => {
        state.statusRegister = "completed";
        state.success =
          action.payload.data !== "" ? action.payload.data.message : "";
        const data = action.payload.data.data;
        localStorage.setItem("accessToken", data.tokens.accessToken);
        HttpService.setToken(data.tokens.accessToken);
        localStorage.setItem("refreshToken", data.tokens.refreshToken);
        HttpService.setLocalRefToken(data.tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .addCase(registerCall.rejected, (state, action) => {
        state.statusRegister = "failed";
        const error = Object(action.payload);
        state.error = errorMessage(error);
      })
      .addCase(verifyEmail.pending, (state) => {
        state.statusVerifyEmail = "loading";
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.statusVerifyEmail = "completed";
        state.success =
          action.payload.data !== "" ? action.payload.data.message : "";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.statusVerifyEmail = "failed";
        const error = Object(action.payload);
        state.error = errorMessage(error);
      });
  },
});
export const {
  resetStatus,
  resetStatusRegister,
  setShowUserLogin,
  setShowEmailVerification,
  resetStatusVerifyEmail,
} = authSlice.actions;
export default authSlice.reducer;
