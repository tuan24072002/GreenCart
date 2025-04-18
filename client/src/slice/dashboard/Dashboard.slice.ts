import { ActionSliceState } from "../state";
import { createSlice } from "@reduxjs/toolkit";
import { errorMessage } from "@/utils/util";
import { DashboardModel } from "@/models/Dashboard.model";
import { DashboardService } from "@/services/Dashboard.service";
import { commonCreateAsyncThunk } from "../thunk";

interface DashboardState extends ActionSliceState {
  item: DashboardModel;
}
const initialState: DashboardState = {
  item: DashboardModel.initialize(),
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const getSummary: any = commonCreateAsyncThunk({
  type: "dashboard/getSummary",
  action: DashboardService.getSummary,
});

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      state.item = action.payload;
    },
    resetActionState: (state) => {
      state.statusAction = "idle";
    },
    resetState: (state) => {
      state.status = "idle";
    },
    changeAction: (state, action) => {
      state.action = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSummary.fulfilled, (state, action) => {
        state.item = action.payload.data ? action.payload.data.data : {};
        state.status = "completed";
      })
      .addCase(getSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSummary.rejected, (state, action) => {
        const error = Object(action.payload);
        state.status = "failed";
        state.error = errorMessage(error);
      });
  },
});
export const { selectItem, resetActionState, changeAction, resetState } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
