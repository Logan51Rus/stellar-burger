import { rootReducer } from '../store';
import store from '../store';

test('тестируем правильную настройку rootReducer', () => {
  const newState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

  expect(newState).toEqual(store.getState());
});
