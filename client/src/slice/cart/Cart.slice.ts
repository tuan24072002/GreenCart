import { ActionSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { createSlice } from "@reduxjs/toolkit";
import { errorMessage } from "@/utils/util";
import { CartService } from "@/services/Cart.service";

interface CartState extends ActionSliceState {
  cartItems: { [key: string]: number };
}
const initialState: CartState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems") as string)
    : {},
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const updateCart: any = commonCreateAsyncThunk({
  type: "cart/updateCart",
  action: CartService.updateCart,
});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetActionState: (state) => {
      state.statusAction = "idle";
    },
    resetState: (state) => {
      state.status = "idle";
    },
    changeAction: (state, action) => {
      state.action = action.payload;
    },
    setCartItem: (state, action) => {
      state.cartItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCart.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.statusAction = "completed";
      })
      .addCase(updateCart.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(updateCart.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      });
  },
});
export const { resetActionState, changeAction, resetState, setCartItem } =
  cartSlice.actions;
export default cartSlice.reducer;
