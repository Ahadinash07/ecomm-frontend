import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subCatId = queryParams.get('subCatId');
  const [filters, setFilters] = useState({
    category: '',
    subcategory: subCatId || '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url;
        let params = {};

        if (filters.subcategory) {
          url = `http://localhost:5376/api/products/subcategory/${filters.subcategory}`;
        } else {
          url = 'http://localhost:5376/api/products/search';
          params = {
            category: filters.category
              ? (await axios.get('http://localhost:5376/api/getCategoriesByCatId/' + filters.category)).data[0][0].catName
              : '',
            brand: filters.brand,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sort: filters.sort,
          };
        }

        const response = await axios.get(url, { params });
        setProducts(response.data.products || response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (loading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen text-2xl text-white bg-gray-900"
    >
      Loading...
    </motion.div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen text-2xl text-red-400 bg-gray-900"
    >
      {error}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-10"
        >
          Products
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <p className="text-white text-center col-span-full">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;