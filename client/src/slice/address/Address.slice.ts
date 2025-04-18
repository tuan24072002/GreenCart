import { ActionSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { createSlice } from "@reduxjs/toolkit";
import { errorMessage } from "@/utils/util";
import { AddressModel } from "@/models/Address.model";
import { AddressService } from "@/services/Address.service";

interface AddressState extends ActionSliceState {
  list: AddressModel[];
  item: AddressModel;
}
const initialState: AddressState = {
  list: [],
  item: AddressModel.initialize(),
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const getAllAddress: any = commonCreateAsyncThunk({
  type: "address/getAll",
  action: AddressService.getAll,
});
export const addItem: any = commonCreateAsyncThunk({
  type: "address/addItem",
  action: AddressService.addItem,
});
export const chooseDefaultAddress: any = commonCreateAsyncThunk({
  type: "address/chooseDefaultAddress",
  action: AddressService.chooseDefaultAddress,
});
export const removeAddress: any = commonCreateAsyncThunk({
  type: "address/removeAddress",
  action: AddressService.removeAddress,
});

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      state.item = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
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
      .addCase(getAllAddress.fulfilled, (state, action) => {
        const list = AddressService.listFromJson(
          action.payload.data ? action.payload.data.data : []
        );
        state.list = list;
        state.item = list[0];
        state.status = "completed";
      })
      .addCase(getAllAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllAddress.rejected, (state, action) => {
        const error = Object(action.payload);
        state.status = "failed";
        state.error = errorMessage(error);
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.statusAction = "completed";
      })
      .addCase(addItem.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(addItem.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      })
      .addCase(chooseDefaultAddress.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.statusAction = "completed";
      })
      .addCase(chooseDefaultAddress.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(chooseDefaultAddress.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.statusAction = "completed";
      })
      .addCase(removeAddress.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(removeAddress.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      });
  },
});
export const {
  selectItem,
  setList,
  resetActionState,
  changeAction,
  resetState,
} = addressSlice.actions;
export default addressSlice.reducer;
