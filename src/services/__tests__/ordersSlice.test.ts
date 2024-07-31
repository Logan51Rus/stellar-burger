import { RequestStatus, TOrder } from '../../utils/types';
import ordersReducer, { getOrders, initialState } from '../ordersSlice';

afterAll(() => {
  jest.resetAllMocks();
});

describe('тестируем получение заказов', () => {
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

  test('обработка getOrders.pending', () => {
    const action = { type: getOrders.pending.type };
    const newState = ordersReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка getOrders.rejected', () => {
    const action = { type: getOrders.rejected.type };
    const newState = ordersReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Failed
    });
  });

  test('обработка getOrders.fulfilled', () => {
    const action = { type: getOrders.fulfilled.type, payload: mockOrders };
    const newState = ordersReducer(initialState, action);

    expect(newState).toEqual({
      orders: mockOrders,
      status: RequestStatus.Success
    });
  });
});
