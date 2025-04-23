import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Placeholder image/icon mapping
const categoryImages = {
  Electronics: 'https://images.unsplash.com/photo-1516321310764-8d8c1e6f9e6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  Fashion: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1586023492125-27b2c9051d25?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  Sports: 'https://images.unsplash.com/photo-1517649763962-97fb64d36b16?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  // Add more mappings as needed
  default: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', // Fallback
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, subCatResponse] = await Promise.all([
          axios.get('http://localhost:5376/api/getCategories'),
          axios.get('http://localhost:5376/api/subCategory'),
        ]);

        setCategories(catResponse.data[0] || catResponse.data);
        setSubcategories(subCatResponse.data.data || subCatResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(selectedCategory === catId ? null : catId);
  };

  const handleSubcategoryClick = (subCatId) => {
    navigate(`/products?subCatId=${subCatId}`);
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 80 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: index * 0.2, ease: 'easeOut' },
    }),
    hover: {
      scale: 1.1,
      rotateX: 5,
      rotateY: 5,
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  const imageVariants = {
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64 text-white text-2xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-t-indigo-500 border-gray-300 rounded-full mr-3"
        />
        Loading categories...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-400 text-2xl py-10"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <section className="mb-12 sm:mb-16 lg:mb-20">
      <motion.h2
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10 text-center"
      >
        Explore Categories
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.catId}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={index}
            whileHover="hover"
            whileTap="tap"
            className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer"
            onClick={() => handleCategoryClick(category.catId)}
          >
            {/* Option 1: Placeholder Image */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${categoryImages[category.catName] || categoryImages.default})`,
              }}
              variants={imageVariants}
              animate="animate"
            >
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/70 to-purple-800/70" />
            </motion.div>

            {/* Option 2: Framer Motion Animated Structure */}
            <motion.div
              className="absolute inset-0 hidden sm:block"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(124, 58, 237, 0.3), transparent 70%)',
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
                transition: { duration: 4, repeat: Infinity },
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 70% 70%, rgba(219, 39, 119, 0.3), transparent 70%)',
                }}
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.5, 0.3, 0.5],
                  transition: { duration: 3, repeat: Infinity },
                }}
              />
            </motion.div>

            <div className="relative h-36 sm:h-44 lg:h-52 flex items-center justify-center">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center px-4 drop-shadow-lg">
                {category.catName}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">Subcategories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {subcategories
                .filter((sub) => sub.catId === selectedCategory)
                .map((subcategory, index) => (
                  <motion.div
                    key={subcategory.subCatId}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-lg shadow-md p-4 cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
                    onClick={() => handleSubcategoryClick(subcategory.subCatId)}
                  >
                    <span className="text-sm sm:text-lg text-white font-semibold">
                      {subcategory.subCatName}
                    </span>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CategorySection;