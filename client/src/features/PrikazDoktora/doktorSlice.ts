import { createSlice } from "@reduxjs/toolkit";
import type { DoktorParams } from "../../models/DoktorParams";

const initialState: DoktorParams = {
  pageNumber: 1,
  pageSize: 8,
  searchTerm: "",
  orderBy: "prezime",
};

export const doktorSlice = createSlice({
  name: "doktorSlice",
  initialState,
  reducers: {
    setPageNumber(state, action) {
      state.pageNumber = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setOrderBy(state, action) {
      state.orderBy = action.payload;
      state.pageNumber = 1;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.pageNumber = 1;
    },
    resetParams() {
      return initialState;
    },
  },
});

export const {
  setOrderBy,
  setPageNumber,
  setPageSize,
  setSearchTerm,
  resetParams,
} = doktorSlice.actions;
