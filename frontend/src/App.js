import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'react-bootstrap';

import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';

import { useGetProfileQuery } from './slices/usersApiSlice';
import { setCredentials, logout } from './slices/authSlice';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const localUserInfo = localStorage.getItem('userInfo');

  // MODIFICADO: A consulta do perfil será pulada se:
  // 1. Não houver informações do usuário no localStorage (primeira carga ou logout limpo)
  // OU
  // 2. Já houver informações do usuário no estado do Redux (indicando que o login já ocorreu via LoginScreen)
  const shouldSkipProfileQuery = !localUserInfo || !!userInfo; 

  const {
    data: profileData,
    isLoading,
    isSuccess,
    isError,
  } = useGetProfileQuery(undefined, {
    skip: shouldSkipProfileQuery, // Usa a condição de pulo modificada
  });

  useEffect(() => {
    if (isSuccess && profileData) {
      dispatch(setCredentials(profileData));
      setProfileLoaded(true);
    } else if (isError) {
      dispatch(logout());
      setProfileLoaded(true);
    } else if (!isLoading && (shouldSkipProfileQuery || !userInfo)) {
      setProfileLoaded(true);
    }
  }, [dispatch, isSuccess, profileData, isError, isLoading, shouldSkipProfileQuery, userInfo]);

  if (!profileLoaded) {
    return <Loader />;
  }

  return (
    <>
      <Header />
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
