import { RequestStatus, TOrder } from '../../utils/types';
import feedReducer, {
  getFeeds,
  getOrderByNumber,
  initialState,
  TFeedState
} from '../feedSlice';

afterAll(() => {
  jest.resetAllMocks();
});

describe('тестируем функциональность ленты заказов', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '669d5f2b119d45001b4fab28',
      ingredients: [
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2024-07-21T19:19:07.528Z',
      updatedAt: '2024-07-21T19:19:07.988Z',
      number: 46865
    },
    {
      _id: '669d614f119d45001b4fab33',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa093f'
      ],
      status: 'done',
      name: 'Метеоритный флюоресцентный люминесцентный бессмертный бургер',
      createdAt: '2024-07-21T19:28:15.850Z',
      updatedAt: '2024-07-21T19:28:16.276Z',
      number: 46869
    }
  ];

  const mockFulfilledGetFeed: TFeedState = {
    ...initialState,
    orders: mockOrders,
    total: 2,
    totalToday: 1,
    status: RequestStatus.Success
  };

  const mockFulfilledGetOrderByNumber = {
    ...initialState,
    orderModalInfo: mockOrders[0],
    status: RequestStatus.Success
  };

  test('обработка getFeeds.pending', () => {
    const action = { type: getFeeds.pending.type };
    const newState = feedReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка getFeeds.rejected', () => {
    const action = { type: getFeeds.rejected.type };
    const newState = feedReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Failed
    });
  });

  test('обработка getFeeds.fulfilled', () => {
    const action = {
      type: getFeeds.fulfilled.type,
      payload: { orders: mockOrders, total: 2, totalToday: 1 }
    };
    const newState = feedReducer(initialState, action);

    expect(newState).toEqual(mockFulfilledGetFeed);
  });

  test('обработка getOrderByNumber.pending', () => {
    const action = { type: getOrderByNumber.pending.type };
    const newState = feedReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка getOrderByNumber.rejected', () => {
    const action = { type: getOrderByNumber.rejected.type };
    const newState = feedReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Failed
    });
  });

  test('обработка getOrderByNumber.fulfilled', () => {
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: mockOrders
    };
    const newState = feedReducer(initialState, action);

    expect(newState).toEqual(mockFulfilledGetOrderByNumber);
  });
});
