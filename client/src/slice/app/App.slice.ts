import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
  logined: boolean;
  user: any;
  language: string;
  showTopBanner: boolean;
}
const initialState: AppState = {
  logined: false,
  user: null,
  language: "vi",
  showTopBanner: true,
};
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setLogined(state, action) {
      state.logined = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setShowTopBanner(state, action) {
      state.showTopBanner = action.payload;
    },
  },
});
export const { setLanguage, setLogined, setUser, setShowTopBanner } =
  appSlice.actions;
export default appSlice.reducer;
