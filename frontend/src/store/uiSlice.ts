import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  currentPage: string;
}

const initialState: UIState = {
  currentPage:
    typeof window !== "undefined" && localStorage.getItem("currentPage")
      ? localStorage.getItem("currentPage")!
      : "summaries",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("currentPage", action.payload);
      }
    },
  },
});

export const { setCurrentPage } = uiSlice.actions;
export default uiSlice.reducer;
