import { TOrdersData, RequestStatus, TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

type TFeedState = TOrdersData & { status: RequestStatus } & {
  orderModalInfo: TOrder | null;
};

const initialState: TFeedState = {
  orders: [],
  orderModalInfo: null,
  total: 0,
  totalToday: 0,
  status: RequestStatus.Idle
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async () => await getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getFeeds.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(
        getFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.status = RequestStatus.Success;
        }
      )
      .addCase(getOrderByNumber.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.orderModalInfo = action.payload[0];
          state.status = RequestStatus.Success;
        }
      );
  },
  selectors: {
    selectorOrderPreview: (state: TFeedState) => state.orders,
    selectorFeedTotal: (state: TFeedState) => state.total,
    selectorFeedTotalToday: (state: TFeedState) => state.totalToday,
    selectorFeedOrderByNumber: (state: TFeedState) => state.orderModalInfo
  }
});

export const {
  selectorOrderPreview,
  selectorFeedTotal,
  selectorFeedTotalToday,
  selectorFeedOrderByNumber
} = feedSlice.selectors;
