import { createSlice } from "@reduxjs/toolkit";
import type { PacijentParams } from "../../models/PacijentParams";

const initialState: PacijentParams = {
  pageNumber: 1,
  pageSize: 8,
  pol: [],
  searchTerm: '',
  orderBy: 'prezime'
}

export const pacijentSlice = createSlice({
  name: 'pacijentSlice',
  initialState,
  reducers: {
    setPageNumber(state, action) {
      state.pageNumber = action.payload
    },
    setPageSize(state, action) {
      state.pageSize = action.payload
    },
    setOrderBy(state, action) {
      state.orderBy = action.payload
      state.pageNumber = 1;
    },
    setPol(state, action) {
      state.pol = action.payload
      state.pageNumber = 1;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
      state.pageNumber = 1;
    },
    resetParams() {
      return initialState;
    }
  }
});

export const { setPol, setOrderBy, setPageNumber, setPageSize, setSearchTerm, resetParams } = pacijentSlice.actions;