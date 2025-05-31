import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './components/Home';
import ProductsPage from './components/ProductsSection';
import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import ProfilePage from './components/ProfilePage';
import PromoPage from './components/PromoSection';
import NewPage from './components/NewPage';
import About from './components/AboutPage';
import AddProduct from './components/AddProductPage';
import ProductDetailPage from './components/ProductDetailPage';
import OrderPage from './components/Order';
import CheckoutPage from './components/CheckoutPage'
import OrderConfirmation from './components/OrderConfirmation'
import OrderHistory from './components/OrderHistory';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductsPage />
          },
          {
            path: ':id', // Route pour les détails d'un produit spécifique
            element: <ProductDetailPage />
          }
        ]
      },
      {
        path: 'add-product',
        element: <AddProduct />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'sales',
        element: <PromoPage />
      },
      {
        path: 'new',
        element: <NewPage />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'orders',
        element: <OrderPage/>
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      },
      {
        path: 'order-confirmation',
        element: <OrderConfirmation />
      },
      {
        path: 'OrderHistory',
        element: <OrderHistory/>

      }

    ]
  }
]);