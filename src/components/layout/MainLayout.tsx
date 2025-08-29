import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Drawer, Toolbar } from '@mui/material';
import { Navbar } from './Navbar';
import { SidebarContent } from './Sidebar';

const drawerWidth = 240;

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer para telas pequenas (mobile) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhora a performance de abertura em mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <SidebarContent />
        </Drawer>
        
        {/* Drawer para telas grandes (desktop) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <SidebarContent />
        </Drawer>
      </Box>

      {/* Conteúdo Principal da Página */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> {/* Espaçador para o conteúdo não ficar atrás da Navbar */}
        <Outlet /> {/* Aqui é onde as páginas da rota serão renderizadas */}
      </Box>
    </Box>
  );
};