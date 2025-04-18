import { ActionSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { createSlice } from "@reduxjs/toolkit";
import { errorMessage } from "@/utils/util";
import { OrderService } from "@/services/Order.service";
import { OrderModel } from "@/models/Order.model";

interface OrderState extends ActionSliceState {
  list: OrderModel[];
  item: OrderModel;
}
const initialState: OrderState = {
  list: [],
  item: OrderModel.initialize(),
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const placeOrderCOD: any = commonCreateAsyncThunk({
  type: "order/placeOrderCOD",
  action: OrderService.placeOrderCOD,
});
export const placeOrderOnline: any = commonCreateAsyncThunk({
  type: "order/placeOrderOnline",
  action: OrderService.placeOrderOnline,
});
export const getUserOrders: any = commonCreateAsyncThunk({
  type: "order/getUserOrders",
  action: OrderService.getUserOrders,
});
export const getAllOrders: any = commonCreateAsyncThunk({
  type: "order/getAllOrders",
  action: OrderService.getAllOrders,
});

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      state.item = action.payload;
    },
    resetActionStateOrder: (state) => {
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
      .addCase(getAllOrders.fulfilled, (state, action) => {
        const list = OrderService.listFromJson(
          action.payload.data ? action.payload.data.data : []
        );
        state.list = list;
        state.status = "completed";
      })
      .addCase(getAllOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        const error = Object(action.payload);
        state.status = "failed";
        state.error = errorMessage(error);
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        const list = OrderService.listFromJson(
          action.payload.data ? action.payload.data.data : []
        );
        state.list = list;
        state.status = "completed";
      })
      .addCase(getUserOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        const error = Object(action.payload);
        state.status = "failed";
        state.error = errorMessage(error);
      })
      .addCase(placeOrderCOD.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.statusAction = "completed";
      })
      .addCase(placeOrderCOD.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(placeOrderCOD.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      })
      .addCase(placeOrderOnline.fulfilled, (state, action) => {
        const item = OrderService.itemFromJson(
          action.payload.data ? action.payload.data.data : []
        );
        state.success = action.payload.data ? action.payload.data.message : "";
        state.item = item;
        state.statusAction = "completed";
      })
      .addCase(placeOrderOnline.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(placeOrderOnline.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      });
  },
});
export const { selectItem, resetActionStateOrder, changeAction, resetState } =
  orderSlice.actions;
export default orderSlice.reducer;
