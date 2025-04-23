import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cartMessage, setCartMessage] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const API_URL = 'http://localhost:5376';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productResponse = await axios.get(`${API_URL}/api/products/details/${productId}`);
        if (!productResponse.data.product) {
          throw new Error('Product not found');
        }
        setProduct(productResponse.data.product);

        // Fetch related products
        const relatedResponse = await axios.get(`${API_URL}/api/products/search?category=${productResponse.data.product.category}&limit=4`);
        setRelatedProducts(relatedResponse.data.products || []);

        // Fetch cart items if user is logged in
        if (user) {
          const token = localStorage.getItem('token');
          const cartResponse = await axios.get(`${API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems(cartResponse.data.items || []);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, user]);

  const handleImageError = (index) => {
    setImageLoadErrors(prev => ({ ...prev, [index]: true }));
  };

  const navigateImage = (direction) => {
    setSelectedImageIndex(prev => {
      const allImages = [...(Array.isArray(product.images) ? product.images : []), ...(Array.isArray(product.descriptionImages) ? product.descriptionImages : [])].filter(Boolean);
      if (direction === 'prev') {
        return prev === 0 ? allImages.length - 1 : prev - 1;
      } else {
        return prev === allImages.length - 1 ? 0 : prev + 1;
      }
    });
  };

  const handleQuantityChange = (change) => {
    if (!product) return;
    const maxQuantity = Math.min(product.quantity || 6, 6);
    setQuantity(prev => Math.max(1, Math.min(maxQuantity, prev + change)));
  };

  const handleAddToCart = async () => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/cart');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const existingCartItem = cartItems.find(item => item.productId === productId);
      const maxQuantity = Math.min(product.quantity || 6, 6);

      if (existingCartItem) {
        // Calculate new quantity
        const newQuantity = existingCartItem.quantity + quantity;

        if (newQuantity > maxQuantity) {
          setCartMessage({
            type: 'warning',
            text: `You cannot add more than ${maxQuantity} items of ${product.productName} to your cart.`,
          });
          setTimeout(() => setCartMessage(null), 3000);
          return;
        }

        // Update existing cart item
        await axios.put(
          `${API_URL}/api/cart/update`,
          { cartId: existingCartItem.cartId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local cart items
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.cartId === existingCartItem.cartId ? { ...item, quantity: newQuantity } : item
          )
        );

        setCartMessage({ type: 'success', text: 'Cart updated successfully!' });
        setTimeout(() => navigate('/cart'), 1000);
      } else {
        // Check if adding new quantity exceeds limit
        if (quantity > maxQuantity) {
          setCartMessage({
            type: 'warning',
            text: `You cannot add more than ${maxQuantity} items of ${product.productName} to your cart.`,
          });
          setTimeout(() => setCartMessage(null), 3000);
          return;
        }

        // Add new cart item
        await axios.post(
          `${API_URL}/api/cart/add`,
          { productId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Refetch cart to get new cartId
        const cartResponse = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartResponse.data.items || []);

        setCartMessage({ type: 'success', text: 'Product added to cart!' });
        setTimeout(() => navigate('/cart'), 1000);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setCartMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add product to cart',
      });
      setTimeout(() => setCartMessage(null), 3000);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
        <strong>Error:</strong> {error}
        <div className="mt-2">
          <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md text-center">
        Product not found
        <div className="mt-2">
          <Link to="/" className="text-indigo-600 hover:underline">Browse our products</Link>
        </div>
      </div>
    </div>
  );

  const mainImages = Array.isArray(product.images) ? product.images : [];
  const descImages = Array.isArray(product.descriptionImages) ? product.descriptionImages : [];
  const allImages = [...mainImages, ...descImages].filter(Boolean);

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <Link to={`/category/${product.category}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
                  {product.category}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  {product.productName}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {cartMessage && (
          <div className={`mb-4 p-4 rounded-md ${cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : cartMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {cartMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden aspect-square">
              {allImages.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImageIndex}
                      src={allImages[selectedImageIndex]}
                      alt={`${product.productName} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-contain p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onError={() => handleImageError(selectedImageIndex)}
                    />
                  </AnimatePresence>
                  {allImages.length > 1 && (
                    <>
                      <button 
                        onClick={() => navigateImage('prev')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                      >
                        <FiChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button 
                        onClick={() => navigateImage('next')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                      >
                        <FiChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-indigo-500' : 'border-transparent'}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.productName}</h1>
              <div className="mt-2 flex items-center flex-wrap gap-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
                </div>
                <span className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
              )}
              {product.discount && (
                <span className="ml-2 text-sm font-medium text-green-600">{product.discount}% OFF</span>
              )}
            </div>

            <div className="prose max-w-none text-gray-700">
              <p>{product.description}</p>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 text-lg font-medium">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center transition-colors"
                disabled={product.quantity <= 0}
              >
                <FiShoppingCart className="mr-2" />
                {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors">
                <FiHeart className="mr-2" />
                Wishlist
              </button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors">
                <FiShare2 className="mr-2" />
                Share
              </button>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
              <div className="mt-4 space-y-4">
                {product.brand && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Brand</span>
                    <span className="text-gray-900 flex-1">{product.brand}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Category</span>
                    <span className="text-gray-900 flex-1">{product.category}</span>
                  </div>
                )}
                {product.subcategory && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Subcategory</span>
                    <span className="text-gray-900 flex-1">{product.subcategory}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Weight</span>
                    <span className="text-gray-900 flex-1">{product.weight} kg</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex flex-wrap">
                    <span className="text-gray-500 w-32">Dimensions</span>
                    <span className="text-gray-900 flex-1">{product.dimensions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;











































// import React, { useEffect, useState, useContext } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import ProductCard from '../components/ProductCard';
// import { AuthContext } from '../context/AuthContext';


// const ProductPage = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const { user, addToCart } = useContext(AuthContext); // Use AuthContext
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [imageLoadErrors, setImageLoadErrors] = useState({});
//   const [quantity, setQuantity] = useState(1);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [cartMessage, setCartMessage] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch product details
//         const productResponse = await axios.get(`http://localhost:5376/api/products/details/${productId}`);
//         if (!productResponse.data.product) {
//           throw new Error('Product not found');
//         }
//         setProduct(productResponse.data.product);
        
//         // Fetch related products
//         const relatedResponse = await axios.get(`http://localhost:5376/api/products/search?category=${productResponse.data.product.category}&limit=4`);
//         setRelatedProducts(relatedResponse.data.products || []);
        
//       } catch (err) {
//         console.error('Fetch Error:', err);
//         setError(err.response?.data?.message || err.message || 'Failed to load product');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [productId]);

//   const handleImageError = (index) => {
//     setImageLoadErrors(prev => ({ ...prev, [index]: true }));
//   };

//   const navigateImage = (direction) => {
//     setSelectedImageIndex(prev => {
//       const allImages = [...(Array.isArray(product.images) ? product.images : []), ...(Array.isArray(product.descriptionImages) ? product.descriptionImages : [])].filter(Boolean);
//       if (direction === 'prev') {
//         return prev === 0 ? allImages.length - 1 : prev - 1;
//       } else {
//         return prev === allImages.length - 1 ? 0 : prev + 1;
//       }
//     });
//   };

//   const handleQuantityChange = (change) => {
//     setQuantity(prev => Math.max(1, Math.min(product.quantity, prev + change)));
//   };

//   const handleAddToCart = async () => {
//     const result = await addToCart(productId, quantity);
//     if (result.redirectToLogin) {
//       // Store the intended destination in localStorage
//       localStorage.setItem('redirectAfterLogin', '/cart');
//       navigate('/login');
//     } else if (result.success) {
//       setCartMessage({ type: 'success', text: result.message });
//       // Optionally navigate to cart page immediately
//       setTimeout(() => navigate('/cart'), 1000);
//     } else {
//       setCartMessage({ type: 'error', text: result.message });
//     }
//     // Clear message after 3 seconds
//     setTimeout(() => setCartMessage(null), 3000);
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center min-h-screen p-4">
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
//         <strong>Error:</strong> {error}
//         <div className="mt-2">
//           <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
//         </div>
//       </div>
//     </div>
//   );

//   if (!product) return (
//     <div className="flex items-center justify-center min-h-screen p-4">
//       <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md text-center">
//         Product not found
//         <div className="mt-2">
//           <Link to="/" className="text-indigo-600 hover:underline">Browse our products</Link>
//         </div>
//       </div>
//     </div>
//   );

//   // Combine all available images
//   const mainImages = Array.isArray(product.images) ? product.images : [];
//   const descImages = Array.isArray(product.descriptionImages) ? product.descriptionImages : [];
//   const allImages = [...mainImages, ...descImages].filter(Boolean);

//   return (
//     <div className="bg-white min-h-screen py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Breadcrumb Navigation */}
//         <nav className="flex mb-6" aria-label="Breadcrumb">
//           <ol className="inline-flex items-center space-x-1 md:space-x-3">
//             <li className="inline-flex items-center">
//               <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
//                 Home
//               </Link>
//             </li>
//             <li>
//               <div className="flex items-center">
//                 <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
//                 </svg>
//                 <Link to={`/category/${product.category}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
//                   {product.category}
//                 </Link>
//               </div>
//             </li>
//             <li aria-current="page">
//               <div className="flex items-center">
//                 <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
//                 </svg>
//                 <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
//                   {product.productName}
//                 </span>
//               </div>
//             </li>
//           </ol>
//         </nav>

//         {/* Cart Message */}
//         {cartMessage && (
//           <div className={`mb-4 p-4 rounded-md ${cartMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//             {cartMessage.text}
//           </div>
//         )}

//         {/* Main Product Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           {/* Image Gallery */}
//           <div className="space-y-4">
//             {/* Main Image */}
//             <div className="relative bg-white rounded-lg shadow-md overflow-hidden aspect-square">
//               {allImages.length > 0 ? (
//                 <>
//                   <AnimatePresence mode="wait">
//                     <motion.img
//                       key={selectedImageIndex}
//                       src={allImages[selectedImageIndex]}
//                       alt={`${product.productName} - Image ${selectedImageIndex + 1}`}
//                       className="w-full h-full object-contain p-4"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       onError={() => handleImageError(selectedImageIndex)}
//                     />
//                   </AnimatePresence>

//                   {/* Navigation Arrows */}
//                   {allImages.length > 1 && (
//                     <>
//                       <button 
//                         onClick={() => navigateImage('prev')}
//                         className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
//                       >
//                         <FiChevronLeft className="w-6 h-6 text-gray-800" />
//                       </button>
//                       <button 
//                         onClick={() => navigateImage('next')}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
//                       >
//                         <FiChevronRight className="w-6 h-6 text-gray-800" />
//                       </button>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                   <span className="text-gray-500">No images available</span>
//                 </div>
//               )}
//             </div>

//             {/* Thumbnails */}
//             {allImages.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto py-2">
//                 {allImages.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImageIndex(index)}
//                     className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-indigo-500' : 'border-transparent'}`}
//                   >
//                     <img
//                       src={img}
//                       alt={`Thumbnail ${index + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={() => handleImageError(index)}
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.productName}</h1>
//               <div className="mt-2 flex items-center flex-wrap gap-4">
//                 <div className="flex items-center">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <svg
//                       key={star}
//                       className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                   <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
//                 </div>
//                 <span className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4">
//               <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
//               {product.originalPrice && (
//                 <span className="ml-2 text-lg text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
//               )}
//               {product.discount && (
//                 <span className="ml-2 text-sm font-medium text-green-600">{product.discount}% OFF</span>
//               )}
//             </div>

//             <div className="prose max-w-none text-gray-700">
//               <p>{product.description}</p>
//             </div>

//             {/* Color Selection */}
//             {product.colors && product.colors.length > 0 && (
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900">Color</h3>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {product.colors.map((color) => (
//                     <button
//                       key={color}
//                       className="w-8 h-8 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       style={{ backgroundColor: color }}
//                       title={color}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection */}
//             {product.sizes && product.sizes.length > 0 && (
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900">Size</h3>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {product.sizes.map((size) => (
//                     <button
//                       key={size}
//                       className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quantity Selector */}
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center border rounded-md">
//                 <button 
//                   onClick={() => handleQuantityChange(-1)}
//                   className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
//                 >
//                   -
//                 </button>
//                 <span className="px-4 py-1 text-lg font-medium">{quantity}</span>
//                 <button 
//                   onClick={() => handleQuantityChange(1)}
//                   className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 mt-6">
//               <button 
//                 onClick={handleAddToCart}
//                 className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center transition-colors"
//                 disabled={product.quantity <= 0}
//               >
//                 <FiShoppingCart className="mr-2" />
//                 {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
//               </button>
//               <button className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors">
//                 <FiHeart className="mr-2" />
//                 Wishlist
//               </button>
//               <button className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors">
//                 <FiShare2 className="mr-2" />
//                 Share
//               </button>
//             </div>

//             {/* Product Details */}
//             <div className="mt-8 border-t border-gray-200 pt-8">
//               <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
//               <div className="mt-4 space-y-4">
//                 {product.brand && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Brand</span>
//                     <span className="text-gray-900 flex-1">{product.brand}</span>
//                   </div>
//                 )}
//                 {product.category && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Category</span>
//                     <span className="text-gray-900 flex-1">{product.category}</span>
//                   </div>
//                 )}
//                 {product.subcategory && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Subcategory</span>
//                     <span className="text-gray-900 flex-1">{product.subcategory}</span>
//                   </div>
//                 )}
//                 {product.weight && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Weight</span>
//                     <span className="text-gray-900 flex-1">{product.weight} kg</span>
//                   </div>
//                 )}
//                 {product.dimensions && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Dimensions</span>
//                     <span className="text-gray-900 flex-1">{product.dimensions}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Related Products */}
//         {relatedProducts.length > 0 && (
//           <div className="mt-16">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {relatedProducts.map(product => (
//                 <ProductCard key={product.productId} product={product} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductPage;



































// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import ProductCard from '../components/ProductCard';

// const ProductPage = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [imageLoadErrors, setImageLoadErrors] = useState({});
//   const [quantity, setQuantity] = useState(1);
//   const [relatedProducts, setRelatedProducts] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch product details
//         const productResponse = await axios.get(`http://localhost:5376/api/products/details/${productId}`);
//         if (!productResponse.data.product) {
//           throw new Error('Product not found');
//         }
//         setProduct(productResponse.data.product);
        
//         // Fetch related products
//         const relatedResponse = await axios.get(`http://localhost:5376/api/products/search?category=${productResponse.data.product.category}&limit=4`);
//         setRelatedProducts(relatedResponse.data.products || []);
        
//       } catch (err) {
//         console.error('Fetch Error:', err);
//         setError(err.response?.data?.message || err.message || 'Failed to load product');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [productId]);

//   const handleImageError = (index) => {
//     setImageLoadErrors(prev => ({ ...prev, [index]: true }));
//   };

//   const navigateImage = (direction) => {
//     setSelectedImageIndex(prev => {
//       if (direction === 'prev') {
//         return prev === 0 ? allImages.length - 1 : prev - 1;
//       } else {
//         return prev === allImages.length - 1 ? 0 : prev + 1;
//       }
//     });
//   };

//   const handleQuantityChange = (change) => {
//     setQuantity(prev => Math.max(1, Math.min(product.quantity, prev + change)));
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center min-h-screen p-4">
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center">
//         <strong>Error:</strong> {error}
//         <div className="mt-2">
//           <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
//         </div>
//       </div>
//     </div>
//   );

//   if (!product) return (
//     <div className="flex items-center justify-center min-h-screen p-4">
//       <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md text-center">
//         Product not found
//         <div className="mt-2">
//           <Link to="/" className="text-indigo-600 hover:underline">Browse our products</Link>
//         </div>
//       </div>
//     </div>
//   );

//   // Combine all available images
//   const mainImages = Array.isArray(product.images) ? product.images : [];
//   const descImages = Array.isArray(product.descriptionImages) ? product.descriptionImages : [];
//   const allImages = [...mainImages, ...descImages].filter(Boolean);

//   return (
//     <div className="bg-white min-h-screen py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Breadcrumb Navigation */}
//         <nav className="flex mb-6" aria-label="Breadcrumb">
//           <ol className="inline-flex items-center space-x-1 md:space-x-3">
//             <li className="inline-flex items-center">
//               <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
//                 Home
//               </Link>
//             </li>
//             <li>
//               <div className="flex items-center">
//                 <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
//                 </svg>
//                 <Link to={`/category/${product.category}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2">
//                   {product.category}
//                 </Link>
//               </div>
//             </li>
//             <li aria-current="page">
//               <div className="flex items-center">
//                 <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                   <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
//                 </svg>
//                 <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
//                   {product.productName}
//                 </span>
//               </div>
//             </li>
//           </ol>
//         </nav>

//         {/* Main Product Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           {/* Image Gallery */}
//           <div className="space-y-4">
//             {/* Main Image */}
//             <div className="relative bg-white rounded-lg shadow-md overflow-hidden aspect-square">
//               {allImages.length > 0 ? (
//                 <>
//                   <AnimatePresence mode="wait">
//                     <motion.img
//                       key={selectedImageIndex}
//                       src={allImages[selectedImageIndex]}
//                       alt={`${product.productName} - Image ${selectedImageIndex + 1}`}
//                       className="w-full h-full object-contain p-4"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       onError={() => handleImageError(selectedImageIndex)}
//                     />
//                   </AnimatePresence>

//                   {/* Navigation Arrows */}
//                   {allImages.length > 1 && (
//                     <>
//                       <button 
//                         onClick={() => navigateImage('prev')}
//                         className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
//                       >
//                         <FiChevronLeft className="w-6 h-6 text-gray-800" />
//                       </button>
//                       <button 
//                         onClick={() => navigateImage('next')}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
//                       >
//                         <FiChevronRight className="w-6 h-6 text-gray-800" />
//                       </button>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                   <span className="text-gray-500">No images available</span>
//                 </div>
//               )}
//             </div>

//             {/* Thumbnails */}
//             {allImages.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto py-2">
//                 {allImages.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImageIndex(index)}
//                     className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-indigo-500' : 'border-transparent'}`}
//                   >
//                     <img
//                       src={img}
//                       alt={`Thumbnail ${index + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={() => handleImageError(index)}
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.productName}</h1>
//               <div className="mt-2 flex items-center flex-wrap gap-4">
//                 <div className="flex items-center">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <svg
//                       key={star}
//                       className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                   <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
//                 </div>
//                 <span className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-4">
//               <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
//               {product.originalPrice && (
//                 <span className="ml-2 text-lg text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
//               )}
//               {product.discount && (
//                 <span className="ml-2 text-sm font-medium text-green-600">{product.discount}% OFF</span>
//               )}
//             </div>

//             <div className="prose max-w-none text-gray-700">
//               <p>{product.description}</p>
//             </div>

//             {/* Color Selection */}
//             {product.colors && product.colors.length > 0 && (
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900">Color</h3>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {product.colors.map((color) => (
//                     <button
//                       key={color}
//                       className="w-8 h-8 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       style={{ backgroundColor: color }}
//                       title={color}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection */}
//             {product.sizes && product.sizes.length > 0 && (
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900">Size</h3>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {product.sizes.map((size) => (
//                     <button
//                       key={size}
//                       className="px-3 py-1 border rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quantity Selector */}
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center border rounded-md">
//                 <button 
//                   onClick={() => handleQuantityChange(-1)}
//                   className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
//                 >
//                   -
//                 </button>
//                 <span className="px-4 py-1 text-lg font-medium">{quantity}</span>
//                 <button 
//                   onClick={() => handleQuantityChange(1)}
//                   className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100"
//                 >
//                   +
//                 </button>
//               </div>
//               {/* <span className="text-sm text-gray-500">
//                 {product.quantity} available
//               </span> */}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 mt-6">
//               <button 
//                 className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center transition-colors"
//                 disabled={product.quantity <= 0}
//               >
//                 <FiShoppingCart className="mr-2" />
//                 {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
//               </button>
//               <button className="flex-1 bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors">
//                 <FiHeart className="mr-2" />
//                 Wishlist
//               </button>
//               <button className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors">
//                 <FiShare2 className="mr-2" />
//                 Share
//               </button>
//             </div>

//             {/* Product Details */}
//             <div className="mt-8 border-t border-gray-200 pt-8">
//               <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
//               <div className="mt-4 space-y-4">
//                 {product.brand && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Brand</span>
//                     <span className="text-gray-900 flex-1">{product.brand}</span>
//                   </div>
//                 )}
//                 {product.category && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Category</span>
//                     <span className="text-gray-900 flex-1">{product.category}</span>
//                   </div>
//                 )}
//                 {product.subcategory && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Subcategory</span>
//                     <span className="text-gray-900 flex-1">{product.subcategory}</span>
//                   </div>
//                 )}
//                 {product.weight && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Weight</span>
//                     <span className="text-gray-900 flex-1">{product.weight} kg</span>
//                   </div>
//                 )}
//                 {product.dimensions && (
//                   <div className="flex flex-wrap">
//                     <span className="text-gray-500 w-32">Dimensions</span>
//                     <span className="text-gray-900 flex-1">{product.dimensions}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Related Products */}
//         {relatedProducts.length > 0 && (
//           <div className="mt-16">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {relatedProducts.map(product => (
//                 <ProductCard key={product.productId} product={product} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductPage;





























// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';

// // Fallback image
// const FALLBACK_IMAGE = '/images/fallback.jpg';
// const FALLBACK_THUMB = '/images/fallback-thumb.jpg';

// // Error Boundary component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center py-8">Something went wrong. Please try again.</div>;
//     }
//     return this.props.children;
//   }
// }

// const ProductPage = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [imageError, setImageError] = useState({});

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:5376/api/products/details/${productId}`);
//         console.log('Product Details:', response.data.product);
//         setProduct(response.data.product);
//       } catch (err) {
//         console.error('Fetch Product Error:', err);
//         setError(err.response?.data?.message || 'Failed to fetch product details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.2 },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
//     hover: { scale: 1.05, transition: { duration: 0.3 } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { type: 'spring', stiffness: 300 } },
//     tap: { scale: 0.95 },
//   };

//   if (loading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
//       >
//         Loading...
//       </motion.div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-red-400 bg-gray-900"
//       >
//         {error}
//       </motion.div>
//     );
//   }

//   if (!product) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
//       >
//         Product not found
//       </motion.div>
//     );
//   }

//   const handleAddToCart = () => {
//     console.log(`Added ${quantity} of ${product.productName} to cart`);
//   };

//   const images = Array.isArray(product.images) && product.images.length > 0 
//     ? product.images 
//     : [FALLBACK_IMAGE];
//   const safeQuantity = Number(product.quantity) || 0;

//   const handleImageError = (index, type) => {
//     if (!imageError[`${type}-${index}`]) {
//       setImageError(prev => ({ ...prev, [`${type}-${index}`]: true }));
//     }
//   };

//   return (
//     <div className="relative min-h-screen bg-gray-900 overflow-hidden">
//       <motion.div
//         className="absolute inset-0 z-0"
//         animate={{
//           background: [
//             'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
//             'radial-gradient(circle at 70% 60%, #7c3aed 0%, #1e40af 100%)',
//             'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
//           ],
//         }}
//         transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
//       >
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900 opacity-30"
//           variants={{
//             animate: {
//               y: [0, -20, 0],
//               opacity: [0.3, 0.5, 0.3],
//               transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
//             },
//           }}
//           animate="animate"
//         />
//       </motion.div>

//       <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">
//         <motion.div
//           className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12"
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <div className="lg:w-1/2">
//             <ErrorBoundary>
//               <motion.div
//                 className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6"
//                 variants={itemVariants}
//               >
//                 <AnimatePresence mode="wait">
//                   <motion.img
//                     key={selectedImage}
//                     src={imageError[`main-${selectedImage}`] ? FALLBACK_IMAGE : images[selectedImage]}
//                     alt={product.productName}
//                     className="w-full h-64 sm:h-80 lg:h-96 object-contain"
//                     onError={() => handleImageError(selectedImage, 'main')}
//                     initial={{ opacity: 0, x: 50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -50 }}
//                     transition={{ duration: 0.3 }}
//                     whileHover={{ scale: 1.05 }}
//                   />
//                 </AnimatePresence>
//               </motion.div>
//             </ErrorBoundary>

//             <motion.div
//               className="flex gap-2 sm:gap-3 overflow-x-auto py-2"
//               variants={sectionVariants}
//             >
//               {images.map((img, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`w-16 h-16 sm:w-20 sm:h-20 rounded border ${selectedImage === index ? 'border-indigo-500' : 'border-gray-300'}`}
//                   variants={itemVariants}
//                   whileHover="hover"
//                 >
//                   <img
//                     src={imageError[`thumb-${index}`] ? FALLBACK_THUMB : img}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover rounded"
//                     onError={() => handleImageError(index, 'thumb')}
//                   />
//                 </motion.button>
//               ))}
//             </motion.div>
//           </div>

//           <motion.div className="lg:w-1/2" variants={sectionVariants}>
//             <motion.h1
//               className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4"
//               variants={itemVariants}
//             >
//               {product.productName}
//             </motion.h1>
//             <motion.div className="flex items-center mb-4 sm:mb-6" variants={itemVariants}>
//               <div className="flex text-yellow-400 mr-2">
//                 {[...Array(5)].map((_, i) => (
//                   <i
//                     key={i}
//                     className={`fas fa-star ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
//                   ></i>
//                 ))}
//               </div>
//               <span className="text-gray-300 text-sm sm:text-base">(24 reviews)</span>
//             </motion.div>

//             <motion.p
//               className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-400 mb-4 sm:mb-6"
//               variants={itemVariants}
//             >
//               ₹{Number(product.price).toFixed(2)}
//             </motion.p>

//             <motion.p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6" variants={itemVariants}>
//               {product.description}
//             </motion.p>

//             <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
//               <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Stock Status:</h3>
//               <motion.span
//                 className={`text-sm sm:text-lg ${safeQuantity > 0 ? 'text-green-400' : 'text-red-400'}`}
//                 animate={safeQuantity > 0 && safeQuantity <= 5 ? { scale: [1, 1.1, 1] } : {}}
//                 transition={{ repeat: Infinity, duration: 1 }}
//               >
//                 {safeQuantity > 0 ? `In Stock (${safeQuantity} available)` : 'Out of Stock'}
//                 {safeQuantity > 0 && safeQuantity <= 5 && ' - Low Stock!'}
//               </motion.span>
//             </motion.div>

//             {product.colors?.length > 0 && (
//               <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
//                 <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Colors:</h3>
//                 <div className="flex gap-2 sm:gap-3">
//                   {product.colors.map((color, index) => (
//                     <motion.button
//                       key={index}
//                       className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300"
//                       style={{ backgroundColor: color.value }}
//                       title={color.name}
//                       variants={buttonVariants}
//                       whileHover="hover"
//                       whileTap="tap"
//                     ></motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             )}

//             {product.sizes?.length > 0 && (
//               <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
//                 <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Sizes:</h3>
//                 <div className="flex flex-wrap gap-2 sm:gap-3">
//                   {product.sizes.map((size, index) => (
//                     <motion.button
//                       key={index}
//                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded text-white hover:bg-indigo-600 text-sm sm:text-base"
//                       variants={buttonVariants}
//                       whileHover="hover"
//                       whileTap="tap"
//                     >
//                       {size}
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             )}

//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Quantity:</h3>
//               <div className="flex items-center">
//                 <motion.button
//                   onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                   className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-l bg-indigo-700 text-white"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   -
//                 </motion.button>
//                 <motion.span
//                   className="px-4 py-1 sm:px-6 sm:py-2 border-t border-b border-gray-300 text-white text-sm sm:text-base"
//                   key={quantity}
//                   initial={{ scale: 0.8 }}
//                   animate={{ scale: 1 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {quantity}
//                 </motion.span>
//                 <motion.button
//                   onClick={() => setQuantity(q => Math.min(safeQuantity, q + 1))}
//                   className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-r bg-indigo-700 text-white"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   +
//                 </motion.button>
//               </div>
//             </motion.div>

//             <motion.button
//               onClick={handleAddToCart}
//               disabled={safeQuantity <= 0}
//               className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base ${
//                 safeQuantity > 0 ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'
//               }`}
//               variants={buttonVariants}
//               whileHover={safeQuantity > 0 ? "hover" : {}}
//               whileTap={safeQuantity > 0 ? "tap" : {}}
//             >
//               {safeQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
//             </motion.button>
//           </motion.div>
//         </motion.div>

//         <motion.div
//           className="mt-12 sm:mt-16 lg:mt-20"
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.h2
//             className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6"
//             variants={itemVariants}
//           >
//             Product Details
//           </motion.h2>

//           {product.features?.length > 0 && (
//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Features</h3>
//               <ul className="list-disc pl-5 text-gray-300 text-sm sm:text-base">
//                 {product.features.map((feature, index) => (
//                   <motion.li key={index} className="mb-1" variants={itemVariants}>
//                     {feature}
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}

//           {product.materials?.length > 0 && (
//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Materials</h3>
//               <motion.p className="text-gray-300 text-sm sm:text-base" variants={itemVariants}>
//                 {product.materials.join(', ')}
//               </motion.p>
//             </motion.div>
//           )}

//           {product.weight && (
//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Weight</h3>
//               <motion.p className="text-gray-300 text-sm sm:text-base" variants={itemVariants}>
//                 {product.weight} kg
//               </motion.p>
//             </motion.div>
//           )}

//           {product.dimensions && (
//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Dimensions</h3>
//               <motion.p className="text-gray-300 text-sm sm:text-base" variants={itemVariants}>
//                 {product.dimensions}
//               </motion.p>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;





























// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';

// // Fallback image (replace with an actual placeholder image in your public folder)
// const FALLBACK_IMAGE = '/images/fallback.jpg'; // Ensure this file exists in public/images/
// const FALLBACK_THUMB = '/images/fallback-thumb.jpg'; // Ensure this file exists

// // Error Boundary component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center py-8">Something went wrong. Please try again.</div>;
//     }
//     return this.props.children;
//   }
// }

// const ProductPage = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [imageError, setImageError] = useState({}); // Track image errors

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:5376/api/products/details/${productId}`);
//         console.log('Product Details:', response.data.product);
//         setProduct(response.data.product);
//       } catch (err) {
//         console.error('Fetch Product Error:', err);
//         setError(err.response?.data?.message || 'Failed to fetch product details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   // Animation variants
//   const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.2 },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
//     hover: { scale: 1.05, transition: { duration: 0.3 } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { type: 'spring', stiffness: 300 } },
//     tap: { scale: 0.95 },
//   };

//   if (loading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
//       >
//         Loading...
//       </motion.div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-red-400 bg-gray-900"
//       >
//         {error}
//       </motion.div>
//     );
//   }

//   if (!product) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
//       >
//         Product not found
//       </motion.div>
//     );
//   }

//   const handleAddToCart = () => {
//     console.log(`Added ${quantity} of ${product.productName} to cart`);
//   };

//   // Image handling with fallback
//   const images = Array.isArray(product.images) && product.images.length > 0 
//     ? product.images 
//     : [FALLBACK_IMAGE];
//   const safeQuantity = Number(product.quantity) || 0;

//   // Handle image errors to prevent infinite re-renders
//   const handleImageError = (index, type) => {
//     if (!imageError[`${type}-${index}`]) {
//       setImageError(prev => ({ ...prev, [`${type}-${index}`]: true }));
//     }
//   };

//   return (
//     <div className="relative min-h-screen bg-gray-900 overflow-hidden">
//       {/* Background similar to Home.jsx */}
//       <motion.div
//         className="absolute inset-0 z-0"
//         animate={{
//           background: [
//             'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
//             'radial-gradient(circle at 70% 60%, #7c3aed 0%, #1e40af 100%)',
//             'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
//           ],
//         }}
//         transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
//       >
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900 opacity-30"
//           variants={{
//             animate: {
//               y: [0, -20, 0],
//               opacity: [0.3, 0.5, 0.3],
//               transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
//             },
//           }}
//           animate="animate"
//         />
//       </motion.div>

//       <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto">
//         <motion.div
//           className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12"
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {/* Product Images */}
//           <div className="lg:w-1/2">
//             <ErrorBoundary>
//               <motion.div
//                 className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6"
//                 variants={itemVariants}
//               >
//                 <AnimatePresence mode="wait">
//                   <motion.img
//                     key={selectedImage}
//                     src={imageError[`main-${selectedImage}`] ? FALLBACK_IMAGE : images[selectedImage]}
//                     alt={product.productName}
//                     className="w-full h-64 sm:h-80 lg:h-96 object-contain"
//                     onError={() => handleImageError(selectedImage, 'main')}
//                     initial={{ opacity: 0, x: 50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -50 }}
//                     transition={{ duration: 0.3 }}
//                     whileHover={{ scale: 1.05 }}
//                   />
//                 </AnimatePresence>
//               </motion.div>
//             </ErrorBoundary>

//             <motion.div
//               className="flex gap-2 sm:gap-3 overflow-x-auto py-2"
//               variants={sectionVariants}
//             >
//               {images.map((img, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => setSelectedImage(index)}
//                   className={`w-16 h-16 sm:w-20 sm:h-20 rounded border ${selectedImage === index ? 'border-indigo-500' : 'border-gray-300'}`}
//                   variants={itemVariants}
//                   whileHover="hover"
//                 >
//                   <img
//                     src={imageError[`thumb-${index}`] ? FALLBACK_THUMB : img}
//                     alt={`Thumbnail ${index + 1}`}
//                     className="w-full h-full object-cover rounded"
//                     onError={() => handleImageError(index, 'thumb')}
//                   />
//                 </motion.button>
//               ))}
//             </motion.div>
//           </div>

//           {/* Product Details */}
//           <motion.div className="lg:w-1/2" variants={sectionVariants}>
//             <motion.h1
//               className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4"
//               variants={itemVariants}
//             >
//               {product.productName}
//             </motion.h1>
//             <motion.div className="flex items-center mb-4 sm:mb-6" variants={itemVariants}>
//               <div className="flex text-yellow-400 mr-2">
//                 {[...Array(5)].map((_, i) => (
//                   <i
//                     key={i}
//                     className={`fas fa-star ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
//                   ></i>
//                 ))}
//               </div>
//               <span className="text-gray-300 text-sm sm:text-base">(24 reviews)</span>
//             </motion.div>

//             <motion.p
//               className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-400 mb-4 sm:mb-6"
//               variants={itemVariants}
//             >
//               ₹{Number(product.price).toFixed(2)}
//             </motion.p>

//             <motion.p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6" variants={itemVariants}>
//               {product.description}
//             </motion.p>

//             <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
//               <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Stock Status:</h3>
//               <motion.span
//                 className={`text-sm sm:text-lg ${safeQuantity > 0 ? 'text-green-400' : 'text-red-400'}`}
//                 animate={safeQuantity > 0 && safeQuantity <= 5 ? { scale: [1, 1.1, 1] } : {}}
//                 transition={{ repeat: Infinity, duration: 1 }}
//               >
//                 {safeQuantity > 0 ? `In Stock (${safeQuantity} available)` : 'Out of Stock'}
//                 {safeQuantity > 0 && safeQuantity <= 5 && ' - Low Stock!'}
//               </motion.span>
//             </motion.div>

//             {product.colors?.length > 0 && (
//               <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
//                 <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Colors:</h3>
//                 <div className="flex gap-2 sm:gap-3">
//                   {product.colors.map((color, index) => (
//                     <motion.button
//                       key={index}
//                       className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300"
//                       style={{ backgroundColor: color.value }}
//                       title={color.name}
//                       variants={buttonVariants}
//                       whileHover="hover"
//                       whileTap="tap"
//                     ></motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             )}

//             {product.sizes?.length > 0 && (
//               <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
//                 <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Sizes:</h3>
//                 <div className="flex flex-wrap gap-2 sm:gap-3">
//                   {product.sizes.map((size, index) => (
//                     <motion.button
//                       key={index}
//                       className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded text-white hover:bg-indigo-600 text-sm sm:text-base"
//                       variants={buttonVariants}
//                       whileHover="hover"
//                       whileTap="tap"
//                     >
//                       {size}
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             )}

//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Quantity:</h3>
//               <div className="flex items-center">
//                 <motion.button
//                   onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                   className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-l bg-indigo-700 text-white"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   -
//                 </motion.button>
//                 <motion.span
//                   className="px-4 py-1 sm:px-6 sm:py-2 border-t border-b border-gray-300 text-white text-sm sm:text-base"
//                   key={quantity}
//                   initial={{ scale: 0.8 }}
//                   animate={{ scale: 1 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {quantity}
//                 </motion.span>
//                 <motion.button
//                   onClick={() => setQuantity(q => Math.min(safeQuantity, q + 1))}
//                   className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-r bg-indigo-700 text-white"
//                   variants={buttonVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                 >
//                   +
//                 </motion.button>
//               </div>
//             </motion.div>

//             <motion.button
//               onClick={handleAddToCart}
//               disabled={safeQuantity <= 0}
//               className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base ${
//                 safeQuantity > 0 ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'
//               }`}
//               variants={buttonVariants}
//               whileHover={safeQuantity > 0 ? "hover" : {}}
//               whileTap={safeQuantity > 0 ? "tap" : {}}
//             >
//               {safeQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
//             </motion.button>
//           </motion.div>
//         </motion.div>

//         {/* Product Description */}
//         <motion.div
//           className="mt-12 sm:mt-16 lg:mt-20"
//           variants={sectionVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.h2
//             className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6"
//             variants={itemVariants}
//           >
//             Product Details
//           </motion.h2>

//           {product.features?.length > 0 && (
//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Features</h3>
//               <ul className="list-disc pl-5 text-gray-300 text-sm sm:text-base">
//                 {product.features.map((feature, index) => (
//                   <motion.li key={index} className="mb-1" variants={itemVariants}>
//                     {feature}
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}

//           {product.materials?.length > 0 && (
//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Materials</h3>
//               <motion.p className="text-gray-300 text-sm sm:text-base" variants={itemVariants}>
//                 {product.materials.join(', ')}
//               </motion.p>
//             </motion.div>
//           )}

//           {product.weight && (
//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Weight</h3>
//               <motion.p className="text-gray-300 text-sm sm:text-base" variants={itemVariants}>
//                 {product.weight} kg
//               </motion.p>
//             </motion.div>
//           )}

//           {product.dimensions && (
//             <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
//               <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Dimensions</h3>
//               <motion.p className="text-gray-300 text-sm sm:text-base" variants={itemVariants}>
//                 {product.dimensions}
//               </motion.p>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;





























// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';

// // Error Boundary component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="text-red-500 text-center">Something went wrong. Please try again.</div>;
//     }
//     return this.props.children;
//   }
// }

// const ProductPage = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:5376/api/products/details/${productId}`);
//         console.log('Product Details:', response.data.product);
//         setProduct(response.data.product);
//       } catch (err) {
//         console.error('Fetch Product Error:', err);
//         setError(err.response?.data?.message || 'Failed to fetch product details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   // Animation variants
//   const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.2 },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
//     hover: { scale: 1.05, transition: { duration: 0.3 } },
//   };

//   const buttonVariants = {
//     hover: { scale: 1.1, transition: { type: 'spring', stiffness: 300 } },
//     tap: { scale: 0.95 },
//   };

//   if (loading) {
//     return (
//       <motion.div
//         className="container mx-auto py-8 text-center"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         Loading...
//       </motion.div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         className="container mx-auto py-8 text-center text-red-500"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {error}
//       </motion.div>
//     );
//   }

//   if (!product) {
//     return (
//       <motion.div
//         className="container mx-auto py-8 text-center"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         Product not found
//       </motion.div>
//     );
//   }

//   const handleAddToCart = () => {
//     console.log(`Added ${quantity} of ${product.productName} to cart`);
//   };

//   // Fallback for images
//   const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['/images/placeholder.jpg'];
//   console.log('Product Images:', images);

//   // Safe quantity
//   const safeQuantity = Number(product.quantity) || 0;
//   console.log('Product Quantity:', safeQuantity);

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <motion.div
//         className="flex flex-col md:flex-row gap-8"
//         variants={sectionVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Product Images */}
//         <div className="md:w-1/2">
//           <ErrorBoundary>
//             <motion.div
//               className="bg-white rounded-lg shadow-md overflow-hidden mb-4"
//               variants={itemVariants}
//             >
//               <AnimatePresence mode="wait">
//                 <motion.img
//                   key={selectedImage}
//                   src={images[selectedImage]}
//                   alt={product.productName}
//                   className="w-full h-96 object-contain"
//                   onError={(e) => {
//                     console.error('Image Load Error:', images[selectedImage]);
//                     e.target.src = '/images/placeholder.jpg';
//                   }}
//                   initial={{ opacity: 0, x: 50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -50 }}
//                   transition={{ duration: 0.3 }}
//                   whileHover={{ scale: 1.1 }}
//                 />
//               </AnimatePresence>
//             </motion.div>
//           </ErrorBoundary>

//           <motion.div
//             className="flex gap-2 overflow-x-auto py-2"
//             variants={sectionVariants}
//           >
//             {images.map((img, index) => (
//               <motion.button
//                 key={index}
//                 onClick={() => setSelectedImage(index)}
//                 className={`w-16 h-16 rounded border ${selectedImage === index ? 'border-blue-500' : 'border-gray-300'}`}
//                 variants={itemVariants}
//                 whileHover="hover"
//               >
//                 <img
//                   src={img}
//                   alt={`Thumbnail ${index + 1}`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     console.error('Thumbnail Load Error:', img);
//                     e.target.src = '/images/placeholder-thumb.jpg';
//                   }}
//                 />
//               </motion.button>
//             ))}
//           </motion.div>
//         </div>

//         {/* Product Details */}
//         <motion.div className="md:w-1/2" variants={sectionVariants}>
//           <motion.h1 className="text-3xl font-bold mb-2" variants={itemVariants}>
//             {product.productName}
//           </motion.h1>
//           <motion.div className="flex items-center mb-4" variants={itemVariants}>
//             <div className="flex text-yellow-400 mr-2">
//               {[...Array(5)].map((_, i) => (
//                 <i
//                   key={i}
//                   className={`fas fa-star ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
//                 ></i>
//               ))}
//             </div>
//             <span className="text-gray-600">(24 reviews)</span>
//           </motion.div>

//           <motion.p className="text-2xl font-bold text-blue-600 mb-4" variants={itemVariants}>
//             ${Number(product.price).toFixed(2)}
//           </motion.p>

//           <motion.p className="text-gray-700 mb-4" variants={itemVariants}>
//             {product.description}
//           </motion.p>

//           <motion.div className="mb-4" variants={itemVariants}>
//             <h3 className="font-semibold mb-2">Stock Status:</h3>
//             <motion.span
//               className={`text-lg ${safeQuantity > 0 ? 'text-green-500' : 'text-red-500'}`}
//               animate={safeQuantity > 0 && safeQuantity <= 5 ? { scale: [1, 1.1, 1] } : {}}
//               transition={{ repeat: Infinity, duration: 1 }}
//             >
//               {safeQuantity > 0 ? `In Stock (${safeQuantity} available)` : 'Out of Stock'}
//               {safeQuantity > 0 && safeQuantity <= 5 && ' - Low Stock!'}
//             </motion.span>
//           </motion.div>

//           {product.colors?.length > 0 && (
//             <motion.div className="mb-4" variants={itemVariants}>
//               <h3 className="font-semibold mb-2">Colors:</h3>
//               <div className="flex gap-2">
//                 {product.colors.map((color, index) => (
//                   <motion.button
//                     key={index}
//                     className="w-8 h-8 rounded-full border border-gray-300"
//                     style={{ backgroundColor: color.value }}
//                     title={color.name}
//                     variants={buttonVariants}
//                     whileHover="hover"
//                     whileTap="tap"
//                   ></motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {product.sizes?.length > 0 && (
//             <motion.div className="mb-4" variants={itemVariants}>
//               <h3 className="font-semibold mb-2">Sizes:</h3>
//               <div className="flex flex-wrap gap-2">
//                 {product.sizes.map((size, index) => (
//                   <motion.button
//                     key={index}
//                     className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
//                     variants={buttonVariants}
//                     whileHover="hover"
//                     whileTap="tap"
//                   >
//                     {size}
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           <motion.div className="mb-6" variants={itemVariants}>
//             <h3 className="font-semibold mb-2">Quantity:</h3>
//             <div className="flex items-center">
//               <motion.button
//                 onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                 className="px-3 py-1 border border-gray-300 rounded-l bg-gray-100"
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap="tap"
//               >
//                 -
//               </motion.button>
//               <motion.span
//                 className="px-4 py-1 border-t border-b border-gray-300"
//                 key={quantity}
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 {quantity}
//               </motion.span>
//               <motion.button
//                 onClick={() => setQuantity(q => q + 1)}
//                 className="px-3 py-1 border border-gray-300 rounded-r bg-gray-100"
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap="tap"
//               >
//                 +
//               </motion.button>
//             </div>
//           </motion.div>

//           <motion.button
//             onClick={handleAddToCart}
//             disabled={safeQuantity <= 0}
//             className={`w-full py-3 rounded-lg font-semibold ${safeQuantity > 0 ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
//             variants={buttonVariants}
//             whileHover={safeQuantity > 0 ? "hover" : {}}
//             whileTap={safeQuantity > 0 ? "tap" : {}}
//           >
//             {safeQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
//           </motion.button>
//         </motion.div>
//       </motion.div>

//       {/* Product Description */}
//       <motion.div
//         className="mt-12"
//         variants={sectionVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <motion.h2 className="text-2xl font-bold mb-4" variants={itemVariants}>
//           Product Details
//         </motion.h2>

//         {product.features?.length > 0 && (
//           <motion.div className="mb-6" variants={itemVariants}>
//             <h3 className="text-xl font-semibold mb-2">Features</h3>
//             <ul className="list-disc pl-5">
//               {product.features.map((feature, index) => (
//                 <motion.li key={index} className="mb-1" variants={itemVariants}>
//                   {feature}
//                 </motion.li>
//               ))}
//             </ul>
//           </motion.div>
//         )}

//         {product.materials?.length > 0 && (
//           <motion.div className="mb-6" variants={itemVariants}>
//             <h3 className="text-xl font-semibold mb-2">Materials</h3>
//             <motion.p variants={itemVariants}>{product.materials.join(', ')}</motion.p>
//           </motion.div>
//         )}

//         {product.weight && (
//           <motion.div className="mb-6" variants={itemVariants}>
//             <h3 className="text-xl font-semibold mb-2">Weight</h3>
//             <motion.p variants={itemVariants}>{product.weight} kg</motion.p>
//           </motion.div>
//         )}

//         {product.dimensions && (
//           <motion.div className="mb-6" variants={itemVariants}>
//             <h3 className="text-xl font-semibold mb-2">Dimensions</h3>
//             <motion.p variants={itemVariants}>{product.dimensions}</motion.p>
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default ProductPage;