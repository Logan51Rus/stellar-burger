import authReducer, {
  setIsAuthChecked,
  setUser,
  initialState,
  loginUser,
  registerUser,
  updateUserData,
  logoutUser,
  TAuthState
} from '../authUser';
import { RequestStatus, TUser } from '../../utils/types';

afterAll(() => {
  jest.restoreAllMocks();
});

describe('тестируем авторизацию', () => {
  const mockUser: TUser = {
    email: 'dmitriy@mail.ru',
    name: 'Dmitriy'
  };

  const mockState: TAuthState = {
    isAuthorized: true,
    user: mockUser,
    status: RequestStatus.Success
  };

  test('устанавливаем статус авторизации пользователя ', () => {
    const action = setIsAuthChecked(true);
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({ ...initialState, isAuthorized: true });
  });

  test('вносим данные пользователя', () => {
    const action = setUser(mockUser);
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({ ...initialState, user: mockUser });
  });

  test('обработка loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка loginUser.rejected', () => {
    const action = { type: loginUser.rejected.type };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({ ...initialState, status: RequestStatus.Failed });
  });

  test('обработка loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      isAuthorized: true,
      user: mockUser,
      status: RequestStatus.Success
    });
  });

  test('обработка registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка registerUser.rejected', () => {
    const action = { type: registerUser.rejected.type };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({ ...initialState, status: RequestStatus.Failed });
  });

  test('обработка registerUser.fulfilled', () => {
    const action = { type: registerUser.fulfilled.type, payload: mockUser };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      user: mockUser,
      status: RequestStatus.Success
    });
  });

  test('обработка updateUserData.pending', () => {
    const action = { type: updateUserData.pending.type };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка updateUserData.rejected', () => {
    const action = { type: updateUserData.rejected.type };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({ ...initialState, status: RequestStatus.Failed });
  });

  test('обработка updateUserData.fulfilled', () => {
    const action = { type: updateUserData.fulfilled.type, payload: mockUser };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      isAuthorized: true,
      user: mockUser,
      status: RequestStatus.Success
    });
  });

  test('обработка logoutUser.pending', () => {
    const action = { type: logoutUser.pending.type };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      status: RequestStatus.Loading
    });
  });

  test('обработка logoutUser.rejected', () => {
    const action = { type: logoutUser.rejected.type };
    const newState = authReducer(initialState, action);

    expect(newState).toEqual({ ...initialState, status: RequestStatus.Failed });
  });

  test('обработка logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const newState = authReducer(mockState, action);

    expect(newState).toEqual({ ...mockState, isAuthorized: false, user: null });
  });
});
