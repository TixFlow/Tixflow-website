"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { restoreLogin, fetchUserProfile, selectAuth } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthReady } = useAppSelector(selectAuth);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken"); // ⬅️ Thêm dòng này
    const user = localStorage.getItem("user");

    if (token && refreshToken && user) {
      dispatch(
        restoreLogin({
          accessToken: token,
          refreshToken: refreshToken,
          user: JSON.parse(user),
        })
      );
    } else if (token) {
      dispatch(fetchUserProfile());
    } else {
      dispatch(
        restoreLogin({ accessToken: null, refreshToken: null, user: null })
      );
    }
  }, [dispatch]);

  if (!isAuthReady) return null;

  return <>{children}</>;
};

export default AuthProvider;
