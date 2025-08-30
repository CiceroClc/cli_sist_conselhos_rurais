import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout e Páginas de Suporte
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';

// Páginas de Associado
import { AssociadosListPage } from '../pages/associados/AssociadosListPage';
import { AssociadoFormPage } from '../pages/associados/AssociadoFormPage';

// Páginas de Conselho
import { ConselhosListPage } from '../pages/conselhos/ConselhosListPage';
import { ConselhoFormPage } from '../pages/conselhos/ConselhoFormPage';

// Páginas de Equipamento
import { EquipamentosListPage } from '../pages/equipamentos/EquipamentosListPage';
import { EquipamentoFormPage } from '../pages/equipamentos/EquipamentoFormPage';

// Páginas de Produto
import { ProdutosListPage } from '../pages/produtos/ProdutosListPage';
import { ProdutoFormPage } from '../pages/produtos/ProdutoFormPage';

// Páginas de Serviço
import { ServicosListPage } from '../pages/servicos/ServicosListPage';
import { ServicoFormPage } from '../pages/servicos/ServicoFormPage';

// Páginas de Reunião do Conselho
import { ReuniaoConselhoListPage } from '../pages/reunioes-conselho/ReuniaoConselhoListPage';
import { ReuniaoConselhoFormPage } from '../pages/reunioes-conselho/ReuniaoConselhoFormPage';

// Páginas de Reunião da Secretaria
import { ReuniaoSecretariaListPage } from '../pages/reunioes-secretaria/ReuniaoSecretariaListPage';
import { ReuniaoSecretariaFormPage } from '../pages/reunioes-secretaria/ReuniaoSecretariaFormPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas que não utilizam o layout principal */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Rotas protegidas que serão renderizadas dentro do MainLayout */}
        <Route element={<MainLayout />}>
        
          {/* Rotas acessíveis por TODOS os perfis autenticados */}
          <Route element={<ProtectedRoute allowedRoles={['GESTOR', 'PRESIDENTE', 'ASSOCIADO']} />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/associados" element={<AssociadosListPage />} />
          </Route>

          {/* Rotas acessíveis por GESTOR e PRESIDENTE */}
          <Route element={<ProtectedRoute allowedRoles={['GESTOR', 'PRESIDENTE']} />}>
            <Route path="/conselhos" element={<ConselhosListPage />} />
            <Route path="/conselhos/novo" element={<ConselhoFormPage />} />
            <Route path="/conselhos/editar/:id" element={<ConselhoFormPage />} />

            <Route path="/associados/novo" element={<AssociadoFormPage />} />
            <Route path="/associados/editar/:id" element={<AssociadoFormPage />} />

            <Route path="/equipamentos" element={<EquipamentosListPage />} />
            <Route path="/equipamentos/novo" element={<EquipamentoFormPage />} />
            <Route path="/equipamentos/editar/:id" element={<EquipamentoFormPage />} />

            <Route path="/reunioes-conselho" element={<ReuniaoConselhoListPage />} />
            <Route path="/reunioes-conselho/novo" element={<ReuniaoConselhoFormPage />} />
            <Route path="/reunioes-conselho/editar/:id" element={<ReuniaoConselhoFormPage />} />
          </Route>

          {/* Rotas exclusivas para GESTOR */}
          <Route element={<ProtectedRoute allowedRoles={['GESTOR']} />}>
            <Route path="/produtos" element={<ProdutosListPage />} />
            <Route path="/produtos/novo" element={<ProdutoFormPage />} />
            <Route path="/produtos/editar/:id" element={<ProdutoFormPage />} />

            <Route path="/servicos" element={<ServicosListPage />} />
            <Route path="/servicos/novo" element={<ServicoFormPage />} />
            <Route path="/servicos/editar/:id" element={<ServicoFormPage />} />

            <Route path="/reunioes-secretaria" element={<ReuniaoSecretariaListPage />} />
            <Route path="/reunioes-secretaria/novo" element={<ReuniaoSecretariaFormPage />} />
            <Route path="/reunioes-secretaria/editar/:id" element={<ReuniaoSecretariaFormPage />} />
          </Route>
        </Route>

        {/* Rota para qualquer outro caminho não definido */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};