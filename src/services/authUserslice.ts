import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi,
  logoutApi,
  getUserApi
} from '../utils/burger-api';
import { RequestStatus, TUser } from '../utils/types';
import { deleteCookie, setCookie, getCookie } from '../utils/cookie';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const updateUserData = createAsyncThunk(
  'auth/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const res = await logoutApi();
  if (res.success) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await getUserApi()
        .then((res) => {
          dispatch(setUser(res.user));
        })
        .catch(() => {
          deleteCookie('accessCookie');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export type TAuthState = {
  isAuthorized: boolean;
  user: TUser | null;
  status: RequestStatus;
};

export const initialState: TAuthState = {
  isAuthorized: false,
  user: null,
  status: RequestStatus.Idle
};

export const authSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.isAuthorized = true;
        state.user = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.user = action.payload;
      })
      .addCase(updateUserData.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(updateUserData.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.isAuthorized = true;
        state.user = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = RequestStatus.Success;
        state.isAuthorized = false;
        state.user = null;
      });
  },
  selectors: {
    selectorUserData: (state: TAuthState) => state.user,
    selectorisUserAuthorized: (state: TAuthState) => state.isAuthorized
  }
});

export const { setIsAuthChecked, setUser } = authSlice.actions;
export const { selectorUserData, selectorisUserAuthorized } =
  authSlice.selectors;
export default authSlice.reducer;
