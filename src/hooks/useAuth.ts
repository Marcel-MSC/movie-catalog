import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser, logout } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  const register = useCallback(
    (email: string, password: string) => {
      return dispatch(registerUser({ email, password }));
    },
    [dispatch],
  );

  const login = useCallback(
    (email: string, password: string) => {
      return dispatch(loginUser({ email, password }));
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    status,
    error,
    register,
    login,
    logout: signOut,
  };
};

