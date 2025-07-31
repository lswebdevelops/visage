// frontend/src/App.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

import { useGetProfileQuery } from "./slices/usersApiSlice";
import { setCredentials, logout } from "./slices/authSlice";
import { setInitialLoadComplete } from "./slices/appSlice";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const initialLoadComplete = useSelector((state) => state.app.initialLoadComplete);

  const hasUserInfoInRedux = !!userInfo;
  const hasUserInfoInLocalStorage = !!localStorage.getItem("userInfo");

  const shouldSkipProfileQuery =
    hasUserInfoInRedux || !hasUserInfoInLocalStorage;

  const {
    data: profileData,
    isLoading,
    isSuccess,
    isError,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: shouldSkipProfileQuery,
  });

  useEffect(() => {
    if (isSuccess && profileData) {
      dispatch(setCredentials(profileData));
      dispatch(setInitialLoadComplete(true));
    } else if (isError) {
      console.error("Erro ao buscar perfil na inicialização:", profileError);
      dispatch(logout());
      dispatch(setInitialLoadComplete(true));
    } else if (!isLoading && shouldSkipProfileQuery) {
      dispatch(setInitialLoadComplete(true));
    } else if (hasUserInfoInRedux && !initialLoadComplete) {
      dispatch(setInitialLoadComplete(true));
    }
  }, [
    dispatch,
    isSuccess,
    profileData,
    isError,
    isLoading,
    shouldSkipProfileQuery,
    hasUserInfoInRedux,
    initialLoadComplete,
    profileError,
  ]);

  if (!initialLoadComplete) {
    return <Loader />;
  }

  return (
    <>
      <Header initialLoadComplete={initialLoadComplete} />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
