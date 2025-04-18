import { ActionSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { createSlice } from "@reduxjs/toolkit";
import { errorMessage } from "@/utils/util";
import { UserService } from "@/services/User.service";
import { UserModel } from "@/models/User.model";

interface UserState extends ActionSliceState {
  item: UserModel;
  statusChangePass: "idle" | "loading" | "completed" | "failed";
}
const initialState: UserState = {
  item: UserModel.initialize(),
  status: "idle",
  statusAction: "idle",
  statusChangePass: "idle",
  action: "INS",
};
export const updateUser: any = commonCreateAsyncThunk({
  type: "user/updateUser",
  action: UserService.updateUser,
});
export const changePassword: any = commonCreateAsyncThunk({
  type: "user/changePassword",
  action: UserService.changePassword,
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetActionState: (state) => {
      state.statusAction = "idle";
    },
    resetState: (state) => {
      state.status = "idle";
    },
    resetStateChangePass: (state) => {
      state.statusChangePass = "idle";
    },
    changeAction: (state, action) => {
      state.action = action.payload;
    },
    selectItem: (state, action) => {
      state.item = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.item = action.payload.data ? action.payload.data.data : {};
        localStorage.setItem("user", JSON.stringify(state.item));
        state.statusAction = "completed";
      })
      .addCase(updateUser.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(updateUser.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.statusChangePass = "completed";
      })
      .addCase(changePassword.pending, (state) => {
        state.statusChangePass = "loading";
      })
      .addCase(changePassword.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusChangePass = "failed";
        state.error = errorMessage(error);
      });
  },
});
export const {
  resetActionState,
  changeAction,
  resetState,
  selectItem,
  resetStateChangePass,
} = userSlice.actions;
export default userSlice.reducer;
