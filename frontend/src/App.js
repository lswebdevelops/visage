import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from './slices/usersApiSlice';
import { setCredentials, logout } from './slices/authSlice'; // Importa a ação logout
import Loader from './components/Loader';

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Estado para controlar se o perfil foi carregado com sucesso
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Determina se a consulta do perfil deve ser ignorada.
  // Ela deve ser executada se houver userInfo no localStorage (indicando um usuário logado)
  // mas o estado userInfo do Redux ainda não foi totalmente hidratado com os dados do perfil.
  const shouldSkipProfileQuery = !localStorage.getItem('userInfo'); // Ignora se não houver userInfo no localStorage

  const { data: profileData, isLoading: isLoadingProfile, isSuccess: isProfileSuccess, isError: isProfileError } = useGetProfileQuery(undefined, {
    skip: shouldSkipProfileQuery,
  });

  useEffect(() => {
    console.log('App useEffect triggered.');
    // console.log('userInfo (redux):', userInfo);
    // console.log('localStorage userInfo:', localStorage.getItem('userInfo'));
    // console.log('shouldSkipProfileQuery:', shouldSkipProfileQuery);
    // console.log('isLoadingProfile:', isLoadingProfile);
    // console.log('isProfileSuccess:', isProfileSuccess);
    // console.log('isProfileError:', isProfileError);
    // console.log('profileLoaded (current):', profileLoaded);


    // Cenário 1: Perfil buscado com sucesso (usuário estava logado e token válido)
    if (isProfileSuccess && profileData) {
      // console.log('Cenário 1: Perfil com sucesso.');
      dispatch(setCredentials(profileData));
      setProfileLoaded(true); // Marca o perfil como carregado
    }
    // Cenário 2: Erro ao buscar o perfil (usuário estava logado, mas token inválido/expirado, ou erro de rede)
    else if (isProfileError) {
      // console.error("Falha ao buscar o perfil do usuário na inicialização do aplicativo:", profileData);
      dispatch(logout()); // Despacha a ação de logout para limpar as informações do usuário
      setProfileLoaded(true); // Marca como carregado para parar o loader e permitir que o aplicativo renderize
    }
    // Cenário 3: Consulta foi ignorada (nenhuma informação de usuário no localStorage)
    // ou a consulta terminou de carregar (sem erro/sucesso).
    // Isso garante que o loader desapareça rapidamente se nenhuma autenticação for esperada.
    else if (!isLoadingProfile && shouldSkipProfileQuery) {
        console.log('Cenário 3: Consulta de perfil finalizada ou ignorada, sem sessão de usuário ativa.');
        setProfileLoaded(true);
    }
    // Cenário 4 (Fallback): Se não estiver carregando, não houver userInfo no Redux e profileLoaded ainda for falso.
    // Isso lida com o carregamento inicial quando não há usuário no localStorage ou Redux.
    else if (!isLoadingProfile && !userInfo && !profileLoaded) {
        console.log('Cenário 4: Fallback - Não está carregando, sem usuário no Redux, e perfil ainda não carregado.');
        setProfileLoaded(true);
    }

  }, [isProfileSuccess, profileData, isProfileError, isLoadingProfile, shouldSkipProfileQuery, dispatch, userInfo, profileLoaded]); // Adicionado userInfo e profileLoaded às dependências

  // Mostra o loader apenas se o perfil ainda não foi carregado
  if (!profileLoaded) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet /> {/* Renderiza o Outlet apenas após o perfil ser carregado */}
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
