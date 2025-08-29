import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AssociadosListPage } from '../pages/associados/AssociadosListPage';
import { ConselhosListPage } from '../pages/conselhos/ConselhosListPage';
import { ProtectedRoute } from './ProtectedRoute';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute allowedRoles={['GESTOR', 'PRESIDENTE', 'ASSOCIADO']} />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/associados" element={<AssociadosListPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['GESTOR', 'PRESIDENTE']} />}>
            <Route path="/conselhos" element={<ConselhosListPage />} />
            {/* Outras rotas para GESTOR e PRESIDENTE */}
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['GESTOR']} />}>
            {/* Rotas exclusivas para GESTOR */}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};