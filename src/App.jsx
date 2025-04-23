import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ChangePassword from './UserInfo&Profile/ChangePassword';
import ForgotPasswordPage from './UserInfo&Profile/ForgotPasswordPage';
import ProfileInfo from './UserInfo&Profile/ProfileInfo';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';

function App() {
  // Use useLocation inside the Router
  const location = useLocation();
  // Define paths where Header and Footer should be hidden
  const hideHeaderFooterPaths = ['/login', '/register'];
  const showHeaderFooter = !hideHeaderFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {showHeaderFooter && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/profile/info" element={<ProfileInfo />} />
          <Route path="/profile/password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

// Wrap App with Router to provide routing context
export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}




































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