import { RequestStatus } from '../../utils/types';
import ingredientsReducer, {
  getIngredients,
  initialState
} from '../ingredientsSlice';

afterAll(() => {
  jest.restoreAllMocks();
});

describe('тестируем получение ингредиентов', () => {
  const mockIngredients = [
    {
      calories: 420,
      carbohydrates: 53,
      fat: 24,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      name: 'Краторная булка N-200i',
      price: 1255,
      proteins: 80,
      type: 'bun',
      __v: 0,
      _id: '643d69a5c3f7b9001cfa093c'
    },
    {
      calories: 4242,
      carbohydrates: 242,
      fat: 142,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      name: 'Биокотлета из марсианской Магнолии',
      price: 424,
      proteins: 420,
      type: 'main',
      __v: 0,
      _id: '643d69a5c3f7b9001cfa0941'
    },
    {
      calories: 77,
      carbohydrates: 55,
      fat: 5,
      image: 'https://code.s3.yandex.net/react/code/sp_1.png',
      image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
      name: 'Плоды Фалленианского дерева',
      price: 874,
      proteins: 20,
      type: 'main',
      __v: 0,
      _id: '643d69a5c3f7b9001cfa0947'
    }
  ];

  test('обработка getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const newState = ingredientsReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка getIngredients.failed', () => {
    const action = { type: getIngredients.rejected.type };
    const newState = ingredientsReducer(initialState, action);

    expect(newState).toEqual({ ...initialState, status: RequestStatus.Failed });
  });

  test('обработка getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const newState = ingredientsReducer(initialState, action);

    expect(newState).toEqual({
      data: mockIngredients,
      status: RequestStatus.Success
    });
  });
});
