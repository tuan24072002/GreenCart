import { PaymentService } from "@/services/Payment.service";
import { ActionSliceState } from "../state";
import { createSlice } from "@reduxjs/toolkit";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "@/utils/util";
import { PaymentModel } from "@/models/Payment.model";

interface PaymentState extends ActionSliceState {
  item: PaymentModel;
  paymentOption: "COD" | "Online";
  showCheckoutOnline: boolean;
  selectedMethod: "momo" | "zalopay" | "vnpay" | string;
}
const initialState: PaymentState = {
  item: PaymentModel.initialize(),
  paymentOption: "COD",
  showCheckoutOnline: false,
  selectedMethod: "",
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const paymentMomo: any = commonCreateAsyncThunk({
  type: "payment/paymentMomo",
  action: PaymentService.paymentMomo,
});
export const checkTransMomo: any = commonCreateAsyncThunk({
  type: "payment/checkTransMomo",
  action: PaymentService.checkTransMomo,
});
export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetActionStatePayment: (state) => {
      state.statusAction = "idle";
    },
    resetState: (state) => {
      state.status = "idle";
    },
    changeAction: (state, action) => {
      state.action = action.payload;
    },
    setPaymentOption: (state, action) => {
      state.paymentOption = action.payload;
    },
    setShowCheckoutOnline: (state, action) => {
      state.showCheckoutOnline = action.payload;
    },
    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(paymentMomo.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.item = action.payload.data ? action.payload.data.data : {};
        state.statusAction = "completed";
      })
      .addCase(paymentMomo.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(paymentMomo.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      })
      .addCase(checkTransMomo.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.statusAction = "completed";
      })
      .addCase(checkTransMomo.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(checkTransMomo.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      });
  },
});
export const {
  resetActionStatePayment,
  changeAction,
  resetState,
  setPaymentOption,
  setShowCheckoutOnline,
  setSelectedMethod,
} = paymentSlice.actions;
export default paymentSlice.reducer;
