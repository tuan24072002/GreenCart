import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthService, AuthenManager } from "@/services/Auth.service";
import { BasicSliceState } from "../state";
import { t } from "i18next";
const authenManager = new AuthenManager();
export const loginCall = createAsyncThunk("signin/login", async (data: any) => {
  const authenService = new AuthService();
  const response = authenService.login(data, authenManager);
  return response;
});
interface SigninState extends BasicSliceState {
  remember: boolean;
  showUserLogin: boolean;
}
const initialState: SigninState = {
  remember: false,
  showUserLogin: false,
  status: "idle",
  error: "",
  action: "VIE",
};

export const signinSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
    },
    setShowUserLogin: (state, action) => {
      state.showUserLogin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginCall.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginCall.fulfilled, (state) => {
        state.status = "completed";
      })
      .addCase(loginCall.rejected, (state, action) => {
        state.status = "failed";
        const code = action.error.code ?? "SYSTEM_ERROR";
        state.error =
          code === "ERR_BAD_REQUEST"
            ? "Tài khoản hoặc mật khẩu không đúng!"
            : t("response." + code);
      });
  },
});
export const { resetStatus, setShowUserLogin } = signinSlice.actions;
export default signinSlice.reducer;
