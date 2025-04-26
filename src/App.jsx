import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext, AuthProvider } from './context/AuthContext';
import ChangePassword from './UserInfo&Profile/ChangePassword';
import ForgotPasswordPage from './UserInfo&Profile/ForgotPasswordPage';
import ProfileInfo from './UserInfo&Profile/ProfileInfo';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import { Toaster } from 'react-hot-toast';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const hideHeaderFooterPaths = ['/login', '/register'];
  const showHeaderFooter = !hideHeaderFooterPaths.includes(location.pathname);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {showHeaderFooter && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/profile/info"
            element={
              <ProtectedRoute>
                <ProfileInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
















































// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import SearchPage from './pages/SearchPage';
// import Products from './pages/Products';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import { AuthProvider } from './context/AuthContext';
// import ChangePassword from './UserInfo&Profile/ChangePassword';
// import ForgotPasswordPage from './UserInfo&Profile/ForgotPasswordPage';
// import ProfileInfo from './UserInfo&Profile/ProfileInfo';
// import ProductPage from './pages/ProductPage';
// import CartPage from './pages/CartPage';

// function App() {
//   // Use useLocation inside the Router
//   const location = useLocation();
//   // Define paths where Header and Footer should be hidden
//   const hideHeaderFooterPaths = ['/login', '/register'];
//   const showHeaderFooter = !hideHeaderFooterPaths.includes(location.pathname);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-900">
//       {showHeaderFooter && <Header />}
//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/search" element={<SearchPage />} />
//           <Route path="/product/:productId" element={<ProductPage />} />
//           <Route path="/profile/info" element={<ProfileInfo />} />
//           <Route path="/profile/password" element={<ChangePassword />} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </main>
//       {showHeaderFooter && <Footer />}
//     </div>
//   );
// }

// // Wrap App with Router to provide routing context
// export default function AppWrapper() {
//   return (
//     <Router>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </Router>
//   );
// }




































// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// // import ProductPage from './pages/ProductPage';
// import SearchPage from './pages/SearchPage';
// import Products from './pages/Products';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import { AuthProvider } from './context/AuthContext';
// // import ProfileInfo from './UserInfo&Profile/ProfileInfo';
// import ChangePassword from './UserInfo&Profile/ChangePassword';
// import ForgotPasswordPage from './UserInfo&Profile/ForgotPasswordPage';


// function App() {
//   return (
    
//     <Router>
//       <AuthProvider>
//       <div className="min-h-screen flex flex-col bg-gray-900">
//         <Header />
//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/products" element={<Products />} />
//             {/* <Route path="/product/:productId" element={<ProductPage />} /> */}
//             <Route path="/search" element={<SearchPage />} />
//             {/* <Route path="/profile/info" element={<ProfileInfo />} /> */}
//             <Route path="/profile/password" element={<ChangePassword />} />
//             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
            
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//       </AuthProvider>
//     </Router>
    
//   );
// }

// export default App;








