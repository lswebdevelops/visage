// frontend/src/components/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const initialLoadComplete = useSelector((state) => state.app?.initialLoadComplete);

  if (!initialLoadComplete) {
    // Pode renderizar um Loader aqui se quiser
    return null;
  }

  return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
