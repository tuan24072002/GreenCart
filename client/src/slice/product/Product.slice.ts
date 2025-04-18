import { ActionSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { createSlice } from "@reduxjs/toolkit";
import { errorMessage } from "@/utils/util";
import { ProductModel } from "@/models/Product.model";
import { ProductService } from "@/services/Product.service";

interface ProductState extends ActionSliceState {
  list: ProductModel[];
  filtered: ProductModel[];
  item: ProductModel;
  itemById: ProductModel;
  page: number;
  hasMore: boolean;
}
const initialState: ProductState = {
  list: [],
  filtered: [],
  item: ProductModel.initialize(),
  itemById: ProductModel.initialize(),
  page: 1,
  hasMore: true,
  status: "idle",
  statusAction: "idle",
  action: "INS",
};
export const fetchAll: any = commonCreateAsyncThunk({
  type: "product/getAll",
  action: ProductService.getAll,
});
export const fetchById: any = commonCreateAsyncThunk({
  type: "product/getById",
  action: ProductService.getById,
});
export const addItem: any = commonCreateAsyncThunk({
  type: "product/addItem",
  action: ProductService.addItem,
});
export const changeStock: any = commonCreateAsyncThunk({
  type: "product/changeStock",
  action: ProductService.changeStock,
});

// export const editItem: any = commonCreateAsyncThunk({
//   type: "product/editItem",
//   action: ProductService.editItem,
// });
// export const deleteItem: any = commonCreateAsyncThunk({
//   type: "product/deleteItem",
//   action: ProductService.deleteItem,
// });

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    selectItem: (state, action) => {
      state.item = action.payload;
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    setFiltered: (state, action) => {
      state.filtered = action.payload;
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
    resetList: (state) => {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.fulfilled, (state, action) => {
        const page = action.payload.data.data.page ?? 1;
        const list = ProductService.listFromJson(
          action.payload.data ? action.payload.data.data.products : []
        );
        const total = action.payload.data.data.total ?? 0;
        if (page === 1) state.list = list;
        else state.list = [...state.list, ...list];
        state.page = page;
        state.hasMore = state.list.length < total;
        state.status = "completed";
      })
      .addCase(fetchAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAll.rejected, (state, action) => {
        const error = Object(action.payload);
        state.status = "failed";
        state.error = errorMessage(error);
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        const item = ProductService.itemFromJson(
          action.payload.data ? action.payload.data.data : []
        );
        state.itemById = item;
        state.status = "completed";
      })
      .addCase(fetchById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchById.rejected, (state, action) => {
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
      .addCase(changeStock.fulfilled, (state, action) => {
        state.success = action.payload.data ? action.payload.data.message : "";
        state.statusAction = "completed";
      })
      .addCase(changeStock.pending, (state) => {
        state.statusAction = "loading";
      })
      .addCase(changeStock.rejected, (state, action) => {
        const error = Object(action.payload);
        state.statusAction = "failed";
        state.error = errorMessage(error);
      });
    //   .addCase(editItem.fulfilled, (state, action) => {
    //     state.item = action.payload.data !== "" ? action.payload.data.data : [];
    //     // state.action = "VIE";
    //     state.statusAction = "completed";
    //   })
    //   .addCase(editItem.pending, (state) => {
    //     state.statusAction = "loading";
    //   })
    //   .addCase(editItem.rejected, (state, action) => {
    //     const error = Object(action.payload);
    //     state.statusAction = "failed";
    //     state.error = errorMessage(error);
    //   })
    //   .addCase(deleteItem.fulfilled, (state) => {
    //     // state.action = "VIE";
    //     state.statusAction = "completed";
    //   })
    //   .addCase(deleteItem.pending, (state) => {
    //     state.statusAction = "loading";
    //   })
    //   .addCase(deleteItem.rejected, (state, action) => {
    //     const error = Object(action.payload);
    //     state.statusAction = "failed";
    //     state.error = errorMessage(error);
    //   });
  },
});
export const {
  selectItem,
  setList,
  resetActionState,
  changeAction,
  resetState,
  setFiltered,
  resetList,
} = productSlice.actions;
export default productSlice.reducer;
