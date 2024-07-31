import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient, RequestStatus } from '../utils/types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type TIngredientState = {
  data: TIngredient[];
  status: RequestStatus;
};

export const initialState: TIngredientState = {
  data: [],
  status: RequestStatus.Idle
};

export const getIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/getIngredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.status = RequestStatus.Success;
          state.data = action.payload;
        }
      );
  },
  selectors: {
    selectorIngredients: (state: TIngredientState) => state.data,
    selectorIngredientsStatus: (state: TIngredientState) => state.status
  }
});

export const { selectorIngredients, selectorIngredientsStatus } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
