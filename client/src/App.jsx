import React, { useState, useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { OrderModalProvider } from './context/OrderModalContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Customer Components & Pages
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import BuyNowModal from './components/BuyNowModal';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Owner Portal Components
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSettings from './pages/admin/AdminSettings';

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentSearch, setCurrentSearch] = useState(window.location.search);
  const [adminTab, setAdminTab] = useState('dashboard');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setCurrentSearch(window.location.search);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (to) => {
    const [path, search] = to.split('?');
    window.history.pushState({}, '', to);
    setCurrentPath(path);
    setCurrentSearch(search ? `?${search}` : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract query parameters
  const queryParams = new URLSearchParams(currentSearch);

  // OWNER PORTAL ROUTING (/admin)
  if (currentPath.startsWith('/admin')) {
    if (currentPath === '/admin/login') {
      if (isAuthenticated) {
        navigate('/admin');
        return null;
      }
      return <AdminLogin navigate={navigate} />;
    }

    if (authLoading) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF6F6' }}>
          <p style={{ color: 'var(--text-muted)' }}>Verifying owner authorization...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <AdminLogin navigate={navigate} />;
    }

    return (
      <AdminLayout activeTab={adminTab} setActiveTab={setAdminTab} navigate={navigate}>
        {adminTab === 'dashboard' && <AdminDashboard setActiveTab={setAdminTab} />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // CUSTOMER WEBSITE ROUTING
  let PageComponent = null;

  if (currentPath === '/') {
    PageComponent = <HomePage navigate={navigate} />;
  } else if (currentPath === '/shop') {
    PageComponent = (
      <ShopPage
        navigate={navigate}
        initialCategory={queryParams.get('category') || ''}
        initialSearch={queryParams.get('search') || ''}
      />
    );
  } else if (currentPath.startsWith('/product/')) {
    const productId = currentPath.replace('/product/', '');
    PageComponent = <ProductDetailsPage productId={productId} navigate={navigate} />;
  } else if (currentPath === '/wishlist') {
    PageComponent = <WishlistPage navigate={navigate} />;
  } else if (currentPath === '/about') {
    PageComponent = <AboutPage navigate={navigate} />;
  } else if (currentPath === '/contact') {
    PageComponent = <ContactPage navigate={navigate} />;
  } else {
    // 404 fallback to Home
    PageComponent = <HomePage navigate={navigate} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header currentRoute={currentPath} navigate={navigate} />
      
      <main style={{ flex: 1 }}>
        {PageComponent}
      </main>

      <Footer navigate={navigate} />
      
      {/* Global Overlays */}
      <BuyNowModal />
      <CartDrawer navigate={navigate} />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderModalProvider>
              <AppContent />
            </OrderModalProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
