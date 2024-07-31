import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api';
import { RequestStatus, TOrder } from '../utils/types';

type TOrdersState = {
  orders: TOrder[];
  status: RequestStatus;
};

export const initialState: TOrdersState = {
  orders: [],
  status: RequestStatus.Idle
};

export const getOrders = createAsyncThunk('orders/getOrders', async () => {
  const res = await getOrdersApi();
  return res;
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getOrders.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(
        getOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          (state.status = RequestStatus.Success),
            (state.orders = action.payload);
        }
      );
  },
  selectors: {
    selectorOrders: (state: TOrdersState) => state.orders
  }
});

export const { selectorOrders } = ordersSlice.selectors;
export default ordersSlice.reducer;
