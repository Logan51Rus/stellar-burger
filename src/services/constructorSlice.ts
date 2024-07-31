import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, TConstructorIngredient, TOrder } from '../utils/types';
import { orderBurgerApi } from '../utils/burger-api';

export type TCounstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  order: TOrder | null;
  status: RequestStatus;
};

export const initialState: TCounstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  order: null,
  status: RequestStatus.Idle
};

export const orderBurger = createAsyncThunk(
  'order/placeOrder',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res.order;
  }
);

export const constructorSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: crypto.randomUUID()
        });
      }
    },
    moveIngredientUp: (state, action) => {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload.id
      );
      const previousElem =
        state.constructorItems.ingredients[ingredientIndex - 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex - 1,
        2,
        action.payload,
        previousElem
      );
    },
    moveIngredientDown: (state, action) => {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload.id
      );
      const nextElem = state.constructorItems.ingredients[ingredientIndex + 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex,
        2,
        nextElem,
        action.payload
      );
    },
    removeIngredient: (state, { payload }: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(payload, 1);
    },
    resetOrder: (state) => {
      state.order = initialState.order;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.constructorItems.bun = initialState.constructorItems.bun;
        state.constructorItems.ingredients =
          initialState.constructorItems.ingredients;
        state.order = action.payload;
      });
  },
  selectors: {
    selectorOrderStatus: (state: TCounstructorState) => state.status,
    selectorOrderModalData: (state: TCounstructorState) => state.order,
    selectorOrder: (state: TCounstructorState) => state.constructorItems
  }
});

export const { selectorOrderStatus, selectorOrderModalData, selectorOrder } =
  constructorSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetOrder
} = constructorSlice.actions;
export default constructorSlice.reducer;
