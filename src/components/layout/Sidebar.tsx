import { Link as RouterLink } from 'react-router-dom';
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import BuildIcon from '@mui/icons-material/Build';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon />, roles: ['GESTOR', 'PRESIDENTE', 'ASSOCIADO'] },
  { text: 'Associados', path: '/associados', icon: <PeopleIcon />, roles: ['GESTOR', 'PRESIDENTE', 'ASSOCIADO'] },
  { text: 'Conselhos', path: '/conselhos', icon: <GroupWorkIcon />, roles: ['GESTOR', 'PRESIDENTE'] },
  { text: 'Equipamentos', path: '/equipamentos', icon: <BuildIcon />, roles: ['GESTOR', 'PRESIDENTE'] },
  { text: 'Reuniões do Conselho', path: '/reunioes-conselho', icon: <GroupsIcon />, roles: ['GESTOR', 'PRESIDENTE'] },
  { text: 'Reuniões da Secretaria', path: '/reunioes-secretaria', icon: <BusinessIcon />, roles: ['GESTOR'] },
  { text: 'Produtos', path: '/produtos', icon: <ShoppingBasketIcon />, roles: ['GESTOR'] },
  { text: 'Serviços', path: '/servicos', icon: <MiscellaneousServicesIcon />, roles: ['GESTOR'] },
];

export const SidebarContent = () => {
  const { hasRole } = useAuth();

  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) =>
          hasRole(item.roles) && (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </div>
  );
};