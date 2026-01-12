import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';

// Контексты
import { AuthProvider } from './contexts/AuthContext';

// Компоненты
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Страницы
import HomePage from './pages/HomePage';
import CarListing from './pages/CarListing';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider 
            maxSnack={3}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            autoHideDuration={3000}
          >
            <AuthProvider>
              <Router>
                <div className="app-container">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/cars" element={<CarListing />} />
                      <Route path="/cars/:id" element={<CarDetails />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/favorites" element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/admin/*" element={
                        <ProtectedRoute requireAdmin>
                          <AdminPanel />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;