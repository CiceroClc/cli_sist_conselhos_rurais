import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AssociadosListPage } from '../pages/associados/AssociadosListPage';
import { ConselhosListPage } from '../pages/conselhos/ConselhosListPage';
import { ProtectedRoute } from './ProtectedRoute';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import { MainLayout } from '../components/layout/MainLayout'; // 1. Importe o layout

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas sem o layout principal */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* 2. Crie uma rota pai que renderiza o MainLayout */}
        <Route element={<MainLayout />}>
          {/* Rotas para todos os usuários autenticados */}
          <Route element={<ProtectedRoute allowedRoles={['GESTOR', 'PRESIDENTE', 'ASSOCIADO']} />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/associados" element={<AssociadosListPage />} />
          </Route>

          {/* Rotas para GESTOR e PRESIDENTE */}
          <Route element={<ProtectedRoute allowedRoles={['GESTOR', 'PRESIDENTE']} />}>
            <Route path="/conselhos" element={<ConselhosListPage />} />
            {/* Adicione aqui as outras páginas: equipamentos, reuniões, etc. */}
          </Route>

          {/* Rotas exclusivas para GESTOR */}
          <Route element={<ProtectedRoute allowedRoles={['GESTOR']} />}>
            {/* ... */}
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};