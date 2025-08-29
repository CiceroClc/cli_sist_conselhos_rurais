import { Link as RouterLink } from 'react-router-dom';
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardIcon />, roles: ['GESTOR', 'PRESIDENTE', 'ASSOCIADO'] },
  { text: 'Associados', path: '/associados', icon: <PeopleIcon />, roles: ['GESTOR', 'PRESIDENTE', 'ASSOCIADO'] },
  { text: 'Conselhos', path: '/conselhos', icon: <GroupWorkIcon />, roles: ['GESTOR', 'PRESIDENTE'] },
  { text: 'Equipamentos', path: '/equipamentos', icon: <HomeWorkIcon />, roles: ['GESTOR', 'PRESIDENTE'] },
  // Adicione outros itens de menu aqui
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