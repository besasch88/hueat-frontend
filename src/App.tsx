import './locales/i18n';
import '@fontsource/inter';
import '@fontsource/inter/300.css';
import '@fontsource/inter/600.css';
import '@fontsource/montserrat';
import '@fontsource/montserrat/600.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { DirectionProvider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { MenuCategoryPage } from '@pages/MenuCategoryPage/MenuCategoryPage';
import { MenuItemPage } from '@pages/MenuItemPage/MenuItemPage';
import { MenuOptionPage } from '@pages/MenuOptionPage/MenuOptionPage';
import { OrderPage } from '@pages/OrderPage/OrderPage';
import { StatisticsPage } from '@pages/StatisticsPage/StatisticsPage';
import { TableListPage } from '@pages/TableListPage/TableListPage';
import { TakeawayListPage } from '@pages/TakeawayListPage/TakeawayListPage';
import { cssVariablesResolver, mantineTheme } from '@styles/theme';
import { ScrollToTop } from '@utils/ScrollToTop';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InternalServerErrorPage } from './pages/InternalServerErrorPage/InternalServerErrorPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { LogoutPage } from './pages/LogoutPage/LogoutPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';

export function App() {
  return (
    <DirectionProvider>
      <MantineProvider theme={mantineTheme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme="light">
        <Notifications />
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Protected main page */}
              <Route path="/" element={<Navigate to="/tables" replace />} />
              <Route path="/tables" element={<TableListPage />} />
              <Route path="/tables/:tableId" element={<OrderPage />} />
              <Route path="/takeaway" element={<TakeawayListPage />} />
              <Route path="/takeaway/:tableId" element={<OrderPage />} />
              <Route path="/menu/categories" element={<MenuCategoryPage />} />
              <Route path="/menu/categories/:menuCategoryId" element={<MenuItemPage />} />
              <Route path="/menu/items/:menuItemId" element={<MenuOptionPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/logout" element={<LogoutPage />} />

              {/* Public login page */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/internal-server-error" element={<InternalServerErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </DirectionProvider>
  );
}
