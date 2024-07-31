import constructorReducer, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
  TCounstructorState,
  orderBurger
} from '../constructorSlice';
import {
  RequestStatus,
  TConstructorIngredient,
  TIngredient,
  TOrder
} from '../../utils/types';

afterAll(() => {
  jest.resetAllMocks();
});

describe('тестируем функциональность конструктора', () => {
  const mockOrder: TOrder = {
    _id: '669dbc36119d45001b4fac10',
    status: 'done',
    name: 'Краторный био-марсианский бургер',
    createdAt: '2024-07-22T01:56:06.507Z',
    updatedAt: '2024-07-22T01:56:06.917Z',
    number: 46900,
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093c'
    ]
  };

  const mockIngredient = {
    _id: '643d69a5c3f7b9001cfa0946',
    name: 'Хрустящие минеральные кольца',
    type: 'main',
    proteins: 808,
    fat: 689,
    carbohydrates: 609,
    calories: 986,
    price: 300,
    image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
    image_mobile:
      'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
  };

  const mockConstructorIngredient: TConstructorIngredient = {
    ...mockIngredient,
    id: 'unique-id'
  };

  const mockBunIngredient: TIngredient = {
    ...mockIngredient,
    type: 'bun'
  };

  test('добавление булки в конструктор', () => {
    const action = addIngredient(mockBunIngredient);
    const newState = constructorReducer(initialState, action);
    expect(newState.constructorItems.bun).toEqual(
      expect.objectContaining({
        ...mockBunIngredient
      })
    );
  });

  test('добавление ингредиента в конструктор', () => {
    const action = addIngredient(mockIngredient);
    const newState = constructorReducer(initialState, action);

    expect(newState.constructorItems.ingredients.length).toBe(1);
    expect(newState.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining({
        ...mockIngredient,
        id: expect.any(String)
      })
    );
  });

  test('удаление ингредиента', () => {
    const preloadedState: TCounstructorState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [mockConstructorIngredient]
      }
    };

    const action = removeIngredient(0);
    const newState = constructorReducer(preloadedState, action);

    expect(newState.constructorItems.ingredients.length).toBe(0);
  });

  test('перемещение ингредиента на позицию выше', () => {
    const firstIngredient = {
      ...mockConstructorIngredient,
      id: '1'
    };

    const secondIngredient = {
      ...mockConstructorIngredient,
      id: '2'
    };

    const preloadedState: TCounstructorState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      }
    };

    const action = moveIngredientUp({ id: '2' });
    const newState = constructorReducer(preloadedState, action);

    expect(newState.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining({ id: '2' })
    );
    expect(newState.constructorItems.ingredients[1]).toEqual(
      expect.objectContaining({ id: '1' })
    );
  });

  test('перемещение ингредиента на позицию ниже', () => {
    const firstIngredient = {
      ...mockConstructorIngredient,
      id: '1'
    };

    const secondIngredient = {
      ...mockConstructorIngredient,
      id: '2'
    };

    const preloadedState: TCounstructorState = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      }
    };

    const action = moveIngredientDown({ id: '1' });
    const newState = constructorReducer(preloadedState, action);

    expect(newState.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining({ id: '2' })
    );
    expect(newState.constructorItems.ingredients[1]).toEqual(
      expect.objectContaining({ id: '1' })
    );
  });

  test('обработка orderBurger.pending', () => {
    const action = { type: orderBurger.pending.type };
    const newState = constructorReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка orderBurger.rejected', () => {
    const action = { type: orderBurger.rejected.type };
    const newState = constructorReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Failed
    });
  });

  test('обработка orderBurger.fulfilled', () => {
    const action = { type: orderBurger.fulfilled.type, payload: mockOrder };
    const newState = constructorReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      order: mockOrder,
      status: RequestStatus.Success
    });
  });
});
