import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import CategorySection from '../components/CategorySection';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 600], [0, 120]);
  const yContent = useTransform(scrollY, [0, 600], [0, 60]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5376/api/products/featured');
        setFeaturedProducts(response.data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const waveVariants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  if (loading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
    >
      Loading...
    </motion.div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-red-400 bg-gray-900"
    >
      {error}
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBackground }}
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
            'radial-gradient(circle at 70% 60%, #7c3aed 0%, #1e40af 100%)',
            'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900 opacity-30"
          variants={waveVariants}
          animate="animate"
        />
      </motion.div>

      <motion.div
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto"
        style={{ y: yContent }}
      >
        <motion.section
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight"
            animate={{ scale: [1, 1.03, 1], textShadow: ['0 0 10px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.5)', '0 0 10px rgba(255,255,255,0.3)'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Elevate Your Shopping
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Discover premium products at irresistible prices!
          </motion.p>
        </motion.section>

        <section className="mb-12 sm:mb-16 lg:mb-20">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
          >
            Featured Products
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence>
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <motion.div key={product.productId}>
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                Array.from({ length: 4 }).map((_, index) => (
                  <motion.div key={index}>
                    <ProductCard
                      product={{
                        productId: index,
                        productName: `Product ${index + 1}`,
                        price: 29.99,
                        description: 'Lorem ipsum dolor sit amet.',
                        quantity: 10,
                        images: ['/images/fallback.jpg'],
                      }}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        <CategorySection />
      </motion.div>
    </div>
  );
};

export default Home;





























// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
// import ProductCard from '../components/ProductCard';

// const Home = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { scrollY } = useScroll();
//   const yBackground = useTransform(scrollY, [0, 600], [0, 120]);
//   const yContent = useTransform(scrollY, [0, 600], [0, 60]);

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5376/api/products/featured');
//         setFeaturedProducts(response.data.products);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch featured products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   const waveVariants = {
//     animate: {
//       y: [0, -20, 0],
//       opacity: [0.3, 0.5, 0.3],
//       transition: {
//         duration: 6,
//         repeat: Infinity,
//         ease: 'easeInOut',
//       },
//     },
//   };

//   if (loading) return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
//     >
//       Loading...
//     </motion.div>
//   );

//   if (error) return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-red-400 bg-gray-900"
//     >
//       {error}
//     </motion.div>
//   );

//   return (
//     <div className="relative min-h-screen bg-gray-900 overflow-hidden">
//       <motion.div
//         className="absolute inset-0 z-0"
//         style={{ y: yBackground }}
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
//           variants={waveVariants}
//           animate="animate"
//         />
//       </motion.div>

//       <motion.div
//         className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto"
//         style={{ y: yContent }}
//       >
//         <motion.section
//           initial={{ opacity: 0, y: 100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.3, ease: 'easeOut' }}
//           className="text-center mb-12 sm:mb-16 lg:mb-20"
//         >
//           <motion.h1
//             className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight"
//             animate={{ scale: [1, 1.03, 1], textShadow: ['0 0 10px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.5)', '0 0 10px rgba(255,255,255,0.3)'] }}
//             transition={{ duration: 4, repeat: Infinity }}
//           >
//             Elevate Your Shopping
//           </motion.h1>
//           <motion.p
//             className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto"
//             animate={{ y: [0, -10, 0] }}
//             transition={{ duration: 2.5, repeat: Infinity }}
//           >
//             Discover premium products at irresistible prices!
//           </motion.p>
//         </motion.section>

//         <section className="mb-12 sm:mb-16 lg:mb-20">
//           <motion.h2
//             // initial={{ opacity: 0, x: -80 }}
//             // animate={{ opacity: 1, x: 0 }}
//             // transition={{ duration: 0.9 }}
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
//           >
//             Featured Products
//           </motion.h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             <AnimatePresence>
//               {featuredProducts.length > 0 ? (
//                 featuredProducts.map((product, index) => (
//                   <motion.div
//                     key={product.productId}
//                     // initial={{ opacity: 0, y: 80, rotate: -8 }}
//                     // animate={{ opacity: 1, y: 0, rotate: 0 }}
//                     // exit={{ opacity: 0, y: 30 }}
//                     // transition={{ duration: 0.8, delay: index * 0.2 }}
//                     // whileHover={{ 
//                     //   y: -10, 
//                     //   scale: 1.03, 
//                     //   boxShadow: '0 15px 30px rgba(0,0,0,0.3)' 
//                     // }}
//                   >
//                     <ProductCard product={product} />
//                   </motion.div>
//                 ))
//               ) : (
//                 Array.from({ length: 4 }).map((_, index) => (
//                   <motion.div
//                     key={index}
//                     // initial={{ opacity: 0, y: 80, rotate: -8 }}
//                     // animate={{ opacity: 1, y: 0, rotate: 0 }}
//                     // transition={{ duration: 0.8, delay: index * 0.2 }}
//                     // whileHover={{ 
//                     //   y: -10, 
//                     //   scale: 1.03, 
//                     //   boxShadow: '0 15px 30px rgba(0,0,0,0.3)' 
//                     // }}
//                   >
//                     {/* <ProductCard 
//                       product={{ 
//                         productId: index, 
//                         productName: `Product ${index + 1}`, 
//                         price: 29.99, 
//                         description: 'Lorem ipsum dolor sit amet.', 
//                         quantity: 10,
//                         images: ['/images/fallback.jpg']
//                       }} 
//                     /> */}
//                   </motion.div>
//                 ))
//               )}
//             </AnimatePresence>
//           </div>
//         </section>

//         <section>
//           <motion.h2
//             initial={{ opacity: 0, x: 80 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.9 }}
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
//           >
//             Explore Categories
//           </motion.h2>
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             {['Electronics', 'Clothing', 'Home & Garden', 'Sports'].map((category, index) => (
//               <motion.div
//                 key={category}
//                 initial={{ opacity: 0, y: 80 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: index * 0.2 }}
//                 whileHover={{
//                   scale: 1.1,
//                   rotateX: 10,
//                   rotateY: 10,
//                   boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
//                   background: 'linear-gradient(135deg, #7c3aed, #db2777)',
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl shadow-lg overflow-hidden"
//               >
//                 <div className="h-36 sm:h-44 lg:h-52 flex items-center justify-center">
//                   <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center px-4">
//                     {category}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       </motion.div>
//     </div>
//   );
// };

// export default Home;





























// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
// import ProductCard from '../components/ProductCard';

// const Home = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { scrollY } = useScroll();
//   const yBackground = useTransform(scrollY, [0, 600], [0, 120]);
//   const yContent = useTransform(scrollY, [0, 600], [0, 60]);

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5376/api/products/featured');
//         // console.log('Featured Products:', response.data.products);
//         setFeaturedProducts(response.data.products);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch featured products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   const particles = Array.from({ length: 25 }).map((_, i) => ({
//     id: i,
//     radius: Math.random() * 130 + 70,
//     speed: Math.random() * 0.7 + 0.3,
//     size: Math.random() * 12 + 6,
//     layer: Math.random() > 0.6 ? 'front' : 'back',
//   }));

//   const waveVariants = {
//     animate: {
//       y: [0, -20, 0],
//       opacity: [0.3, 0.5, 0.3],
//       transition: {
//         duration: 6,
//         repeat: Infinity,
//         ease: 'easeInOut',
//       },
//     },
//   };

//   if (loading) return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
//     >
//       Loading...
//     </motion.div>
//   );

//   if (error) return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-red-400 bg-gray-900"
//     >
//       {error}
//     </motion.div>
//   );

//   return (
//     <div className="relative min-h-screen bg-gray-900 overflow-hidden">
//       <motion.div
//         className="absolute inset-0 z-0"
//         style={{ y: yBackground }}
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
//           variants={waveVariants}
//           animate="animate"
//         />
//         {particles
//           .filter(p => p.layer === 'back')
//           .map(particle => (
//             <motion.div
//               key={`back-${particle.id}`}
//               className="absolute rounded-full bg-indigo-300 opacity-25"
//               style={{
//                 width: particle.size,
//                 height: particle.size,
//                 left: '50%',
//                 top: '50%',
//               }}
//               animate={{
//                 x: [
//                   particle.radius * Math.cos(0),
//                   particle.radius * Math.cos(Math.PI / 2),
//                   particle.radius * Math.cos(Math.PI),
//                   particle.radius * Math.cos(3 * Math.PI / 2),
//                   particle.radius * Math.cos(2 * Math.PI),
//                 ],
//                 y: [
//                   particle.radius * Math.sin(0),
//                   particle.radius * Math.sin(Math.PI / 2),
//                   particle.radius * Math.sin(Math.PI),
//                   particle.radius * Math.sin(3 * Math.PI / 2),
//                   particle.radius * Math.sin(2 * Math.PI),
//                 ],
//                 opacity: [0.15, 0.35, 0.15],
//               }}
//               transition={{
//                 duration: particle.speed * 12,
//                 repeat: Infinity,
//                 ease: 'linear',
//               }}
//             />
//           ))}
//         {particles
//           .filter(p => p.layer === 'front')
//           .map(particle => (
//             <motion.div
//               key={`front-${particle.id}`}
//               className="absolute rounded-full bg-white opacity-35"
//               style={{
//                 width: particle.size * 0.7,
//                 height: particle.size * 0.7,
//                 left: '50%',
//                 top: '50%',
//               }}
//               animate={{
//                 x: [
//                   particle.radius * Math.cos(0),
//                   particle.radius * Math.cos(-Math.PI / 2),
//                   particle.radius * Math.cos(-Math.PI),
//                   particle.radius * Math.cos(-3 * Math.PI / 2),
//                   particle.radius * Math.cos(-2 * Math.PI),
//                 ],
//                 y: [
//                   particle.radius * Math.sin(0),
//                   particle.radius * Math.sin(-Math.PI / 2),
//                   particle.radius * Math.sin(-Math.PI),
//                   particle.radius * Math.sin(-3 * Math.PI / 2),
//                   particle.radius * Math.sin(-2 * Math.PI),
//                 ],
//                 opacity: [0.25, 0.55, 0.25],
//               }}
//               transition={{
//                 duration: particle.speed * 9,
//                 repeat: Infinity,
//                 ease: 'linear',
//               }}
//             />
//           ))}
//       </motion.div>

//       <motion.div
//         className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto"
//         style={{ y: yContent }}
//       >
//         <motion.section
//           initial={{ opacity: 0, y: 100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.3, ease: 'easeOut' }}
//           className="text-center mb-12 sm:mb-16 lg:mb-20"
//         >
//           <motion.h1
//             className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight"
//             animate={{ scale: [1, 1.03, 1], textShadow: ['0 0 10px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.5)', '0 0 10px rgba(255,255,255,0.3)'] }}
//             transition={{ duration: 4, repeat: Infinity }}
//           >
//             Elevate Your Shopping
//           </motion.h1>
//           <motion.p
//             className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto"
//             animate={{ y: [0, -10, 0] }}
//             transition={{ duration: 2.5, repeat: Infinity }}
//           >
//             Discover premium products at irresistible prices!
//           </motion.p>
//         </motion.section>

//         <section className="mb-12 sm:mb-16 lg:mb-20">
//           <motion.h2
//             initial={{ opacity: 0, x: -80 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.9 }}
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
//           >
//             Featured Products
//           </motion.h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             <AnimatePresence>
//               {featuredProducts.length > 0 ? (
//                 featuredProducts.map((product, index) => (
//                   <motion.div
//                     key={product.productId}
//                     initial={{ opacity: 0, y: 80, rotate: -8 }}
//                     animate={{ opacity: 1, y: 0, rotate: 0 }}
//                     exit={{ opacity: 0, y: 30 }}
//                     transition={{ duration: 0.8, delay: index * 0.2 }}
//                     whileHover={{ 
//                       y: -10, 
//                       scale: 1.03, 
//                       boxShadow: '0 15px 30px rgba(0,0,0,0.3)' 
//                     }}
//                   >
//                     <ProductCard product={product} />
//                   </motion.div>
//                 ))
//               ) : (
//                 Array.from({ length: 4 }).map((_, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 80, rotate: -8 }}
//                     animate={{ opacity: 1, y: 0, rotate: 0 }}
//                     transition={{ duration: 0.8, delay: index * 0.2 }}
//                     whileHover={{ 
//                       y: -10, 
//                       scale: 1.03, 
//                       boxShadow: '0 15px 30px rgba(0,0,0,0.3)' 
//                     }}
//                   >
//                     <ProductCard 
//                       product={{ 
//                         productId: index, 
//                         productName: `Product ${index + 1}`, 
//                         price: 29.99, 
//                         description: 'Lorem ipsum dolor sit amet.', 
//                         quantity: 10,
//                         images: ['/images/fallback.jpg']
//                       }} 
//                     />
//                   </motion.div>
//                 ))
//               )}
//             </AnimatePresence>
//           </div>
//         </section>

//         <section>
//           <motion.h2
//             initial={{ opacity: 0, x: 80 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.9 }}
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
//           >
//             Explore Categories
//           </motion.h2>
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             {['Electronics', 'Clothing', 'Home & Garden', 'Sports'].map((category, index) => (
//               <motion.div
//                 key={category}
//                 initial={{ opacity: 0, y: 80 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: index * 0.2 }}
//                 whileHover={{
//                   scale: 1.1,
//                   rotateX: 10,
//                   rotateY: 10,
//                   boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
//                   background: 'linear-gradient(135deg, #7c3aed, #db2777)',
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl shadow-lg overflow-hidden"
//               >
//                 <div className="h-36 sm:h-44 lg:h-52 flex items-center justify-center">
//                   <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center px-4">
//                     {category}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       </motion.div>
//     </div>
//   );
// };

// export default Home;





























// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
// import ProductCard from '../components/ProductCard';

// const Home = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { scrollY } = useScroll();
//   const yBackground = useTransform(scrollY, [0, 600], [0, 120]);
//   const yContent = useTransform(scrollY, [0, 600], [0, 60]);

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5376/api/products/featured');
//         console.log('Featured Products:', response.data.products);
//         setFeaturedProducts(response.data.products);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch featured products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   const particles = Array.from({ length: 25 }).map((_, i) => ({
//     id: i,
//     radius: Math.random() * 130 + 70,
//     speed: Math.random() * 0.7 + 0.3,
//     size: Math.random() * 12 + 6,
//     layer: Math.random() > 0.6 ? 'front' : 'back',
//   }));

//   const waveVariants = {
//     animate: {
//       y: [0, -20, 0],
//       opacity: [0.3, 0.5, 0.3],
//       transition: {
//         duration: 6,
//         repeat: Infinity,
//         ease: 'easeInOut',
//       },
//     },
//   };

//   if (loading) return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
//     >
//       Loading...
//     </motion.div>
//   );

//   if (error) return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-red-400 bg-gray-900"
//     >
//       {error}
//     </motion.div>
//   );

//   return (
//     <div className="relative min-h-screen bg-gray-900 overflow-hidden">
//       <motion.div
//         className="absolute inset-0 z-0"
//         style={{ y: yBackground }}
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
//           variants={waveVariants}
//           animate="animate"
//         />
//         {particles
//           .filter(p => p.layer === 'back')
//           .map(particle => (
//             <motion.div
//               key={`back-${particle.id}`}
//               className="absolute rounded-full bg-indigo-300 opacity-25"
//               style={{
//                 width: particle.size,
//                 height: particle.size,
//                 left: '50%',
//                 top: '50%',
//               }}
//               animate={{
//                 x: [
//                   particle.radius * Math.cos(0),
//                   particle.radius * Math.cos(Math.PI / 2),
//                   particle.radius * Math.cos(Math.PI),
//                   particle.radius * Math.cos(3 * Math.PI / 2),
//                   particle.radius * Math.cos(2 * Math.PI),
//                 ],
//                 y: [
//                   particle.radius * Math.sin(0),
//                   particle.radius * Math.sin(Math.PI / 2),
//                   particle.radius * Math.sin(Math.PI),
//                   particle.radius * Math.sin(3 * Math.PI / 2),
//                   particle.radius * Math.sin(2 * Math.PI),
//                 ],
//                 opacity: [0.15, 0.35, 0.15],
//               }}
//               transition={{
//                 duration: particle.speed * 12,
//                 repeat: Infinity,
//                 ease: 'linear',
//               }}
//             />
//           ))}
//         {particles
//           .filter(p => p.layer === 'front')
//           .map(particle => (
//             <motion.div
//               key={`front-${particle.id}`}
//               className="absolute rounded-full bg-white opacity-35"
//               style={{
//                 width: particle.size * 0.7,
//                 height: particle.size * 0.7,
//                 left: '50%',
//                 top: '50%',
//               }}
//               animate={{
//                 x: [
//                   particle.radius * Math.cos(0),
//                   particle.radius * Math.cos(-Math.PI / 2),
//                   particle.radius * Math.cos(-Math.PI),
//                   particle.radius * Math.cos(-3 * Math.PI / 2),
//                   particle.radius * Math.cos(-2 * Math.PI),
//                 ],
//                 y: [
//                   particle.radius * Math.sin(0),
//                   particle.radius * Math.sin(-Math.PI / 2),
//                   particle.radius * Math.sin(-Math.PI),
//                   particle.radius * Math.sin(-3 * Math.PI / 2),
//                   particle.radius * Math.sin(-2 * Math.PI),
//                 ],
//                 opacity: [0.25, 0.55, 0.25],
//               }}
//               transition={{
//                 duration: particle.speed * 9,
//                 repeat: Infinity,
//                 ease: 'linear',
//               }}
//             />
//           ))}
//       </motion.div>

//       <motion.div
//         className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto"
//         style={{ y: yContent }}
//       >
//         <motion.section
//           initial={{ opacity: 0, y: 100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.3, ease: 'easeOut' }}
//           className="text-center mb-12 sm:mb-16 lg:mb-20"
//         >
//           <motion.h1
//             className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight"
//             animate={{ scale: [1, 1.03, 1], textShadow: ['0 0 10px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.5)', '0 0 10px rgba(255,255,255,0.3)'] }}
//             transition={{ duration: 4, repeat: Infinity }}
//           >
//             Elevate Your Shopping
//           </motion.h1>
//           <motion.p
//             className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto"
//             animate={{ y: [0, -10, 0] }}
//             transition={{ duration: 2.5, repeat: Infinity }}
//           >
//             Discover premium products at irresistible prices!
//           </motion.p>
//         </motion.section>

//         <section className="mb-12 sm:mb-16 lg:mb-20">
//           <motion.h2
//             initial={{ opacity: 0, x: -80 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.9 }}
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
//           >
//             Featured Products
//           </motion.h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             <AnimatePresence>
//               {featuredProducts.length > 0 ? (
//                 featuredProducts.map((product, index) => (
//                   <motion.div
//                     key={product.productId}
//                     initial={{ opacity: 0, y: 80, rotate: -8 }}
//                     animate={{ opacity: 1, y: 0, rotate: 0 }}
//                     exit={{ opacity: 0, y: 30 }}
//                     transition={{ duration: 0.8, delay: index * 0.2 }}
//                     whileHover={{ 
//                       y: -10, 
//                       scale: 1.03, 
//                       boxShadow: '0 15px 30px rgba(0,0,0,0.3)' 
//                     }}
//                   >
//                     <ProductCard product={product} />
//                   </motion.div>
//                 ))
//               ) : (
//                 Array.from({ length: 4 }).map((_, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 80, rotate: -8 }}
//                     animate={{ opacity: 1, y: 0, rotate: 0 }}
//                     transition={{ duration: 0.8, delay: index * 0.2 }}
//                     whileHover={{ 
//                       y: -10, 
//                       scale: 1.03, 
//                       boxShadow: '0 15px 30px rgba(0,0,0,0.3)' 
//                     }}
//                   >
//                     <ProductCard 
//                       product={{ 
//                         productId: index, 
//                         productName: `Product ${index + 1}`, 
//                         price: 29.99, 
//                         description: 'Lorem ipsum dolor sit amet.', 
//                         quantity: 10 
//                       }} 
//                     />
//                   </motion.div>
//                 ))
//               )}
//             </AnimatePresence>
//           </div>
//         </section>

//         <section>
//           <motion.h2
//             initial={{ opacity: 0, x: 80 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.9 }}
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
//           >
//             Explore Categories
//           </motion.h2>
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             {['Electronics', 'Clothing', 'Home & Garden', 'Sports'].map((category, index) => (
//               <motion.div
//                 key={category}
//                 initial={{ opacity: 0, y: 80 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: index * 0.2 }}
//                 whileHover={{
//                   scale: 1.1,
//                   rotateX: 10,
//                   rotateY: 10,
//                   boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
//                   background: 'linear-gradient(135deg, #7c3aed, #db2777)',
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl shadow-lg overflow-hidden"
//               >
//                 <div className="h-36 sm:h-44 lg:h-52 flex items-center justify-center">
//                   <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center px-4">
//                     {category}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       </motion.div>
//     </div>
//   );
// };

// export default Home;















// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
// import ProductCard from '../components/ProductCard';

// const Home = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { scrollY } = useScroll();
//   const yBackground = useTransform(scrollY, [0, 600], [0, 120]); // Parallax for background
//   const yContent = useTransform(scrollY, [0, 600], [0, 60]); // Parallax for content

//   useEffect(() => {
//     const fetchFeaturedProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5376/api/products/featured');
//         console.log('Featured Products:', response.data.products);
//         setFeaturedProducts(response.data.products);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch featured products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeaturedProducts();
//   }, []);

//   // Particle system with layered effects
//   const particles = Array.from({ length: 25 }).map((_, i) => ({
//     id: i,
//     radius: Math.random() * 130 + 70,
//     speed: Math.random() * 0.7 + 0.3,
//     size: Math.random() * 12 + 6,
//     layer: Math.random() > 0.6 ? 'front' : 'back',
//   }));

//   // Wave effect for background
//   const waveVariants = {
//     animate: {
//       y: [0, -20, 0],
//       opacity: [0.3, 0.5, 0.3],
//       transition: {
//         duration: 6,
//         repeat: Infinity,
//         ease: 'easeInOut',
//       },
//     },
//   };

//   if (loading) return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-white bg-gray-900"
//     >
//       Loading...
//     </motion.div>
//   );

//   if (error) return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//       className="flex items-center justify-center min-h-screen text-2xl sm:text-3xl font-bold text-red-400 bg-gray-900"
//     >
//       {error}
//     </motion.div>
//   );

//   return (
//     <div className="relative min-h-screen bg-gray-900 overflow-hidden">
//       {/* Animated Background with Waves and Particles */}
//       <motion.div
//         className="absolute inset-0 z-0"
//         style={{ y: yBackground }}
//         animate={{
//           background: [
//             'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
//             'radial-gradient(circle at 70% 60%, #7c3aed 0%, #1e40af 100%)',
//             'radial-gradient(circle at 30% 40%, #4b5563 0%, #1e40af 100%)',
//           ],
//         }}
//         transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
//       >
//         {/* Wave Layer */}
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900 opacity-30"
//           variants={waveVariants}
//           animate="animate"
//         />
//         {/* Back Layer Particles */}
//         {particles
//           .filter(p => p.layer === 'back')
//           .map(particle => (
//             <motion.div
//               key={`back-${particle.id}`}
//               className="absolute rounded-full bg-indigo-300 opacity-25"
//               style={{
//                 width: particle.size,
//                 height: particle.size,
//                 left: '50%',
//                 top: '50%',
//               }}
//               animate={{
//                 x: [
//                   particle.radius * Math.cos(0),
//                   particle.radius * Math.cos(Math.PI / 2),
//                   particle.radius * Math.cos(Math.PI),
//                   particle.radius * Math.cos(3 * Math.PI / 2),
//                   particle.radius * Math.cos(2 * Math.PI),
//                 ],
//                 y: [
//                   particle.radius * Math.sin(0),
//                   particle.radius * Math.sin(Math.PI / 2),
//                   particle.radius * Math.sin(Math.PI),
//                   particle.radius * Math.sin(3 * Math.PI / 2),
//                   particle.radius * Math.sin(2 * Math.PI),
//                 ],
//                 opacity: [0.15, 0.35, 0.15],
//               }}
//               transition={{
//                 duration: particle.speed * 12,
//                 repeat: Infinity,
//                 ease: 'linear',
//               }}
//             />
//           ))}
//         {/* Front Layer Particles */}
//         {particles
//           .filter(p => p.layer === 'front')
//           .map(particle => (
//             <motion.div
//               key={`front-${particle.id}`}
//               className="absolute rounded-full bg-white opacity-35"
//               style={{
//                 width: particle.size * 0.7,
//                 height: particle.size * 0.7,
//                 left: '50%',
//                 top: '50%',
//               }}
//               animate={{
//                 x: [
//                   particle.radius * Math.cos(0),
//                   particle.radius * Math.cos(-Math.PI / 2),
//                   particle.radius * Math.cos(-Math.PI),
//                   particle.radius * Math.cos(-3 * Math.PI / 2),
//                   particle.radius * Math.cos(-2 * Math.PI),
//                 ],
//                 y: [
//                   particle.radius * Math.sin(0),
//                   particle.radius * Math.sin(-Math.PI / 2),
//                   particle.radius * Math.sin(-Math.PI),
//                   particle.radius * Math.sin(-3 * Math.PI / 2),
//                   particle.radius * Math.sin(-2 * Math.PI),
//                 ],
//                 opacity: [0.25, 0.55, 0.25],
//               }}
//               transition={{
//                 duration: particle.speed * 9,
//                 repeat: Infinity,
//                 ease: 'linear',
//               }}
//             />
//           ))}
//       </motion.div>

//       {/* Main Content */}
//       <motion.div
//         className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto"
//         style={{ y: yContent }}
//       >
//         {/* Hero Section */}
//         <motion.section
//           initial={{ opacity: 0, y: 100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.3, ease: 'easeOut' }}
//           className="text-center mb-12 sm:mb-16 lg:mb-20"
//         >
//           <motion.h1
//             className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight"
//             animate={{ scale: [1, 1.03, 1], textShadow: ['0 0 10px rgba(255,255,255,0.3)', '0 0 20px rgba(255,255,255,0.5)', '0 0 10px rgba(255,255,255,0.3)'] }}
//             transition={{ duration: 4, repeat: Infinity }}
//           >
//             Elevate Your Shopping
//           </motion.h1>
//           <motion.p
//             className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto"
//             animate={{ y: [0, -10, 0] }}
//             transition={{ duration: 2.5, repeat: Infinity }}
//           >
//             Discover premium products at irresistible prices!
//           </motion.p>
//         </motion.section>

//         {/* Featured Products */}
//         <section className="mb-12 sm:mb-16 lg:mb-20">
//           <motion.h2
//             initial={{ opacity: 0, x: -80 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.9 }}
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
//           >
//             Featured Products
//           </motion.h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             <AnimatePresence>
//               {featuredProducts.length > 0 ? (
//                 featuredProducts.map((product, index) => (
//                   <motion.div
//                     key={product.productId}
//                     initial={{ opacity: 0, y: 80, rotate: -8 }}
//                     animate={{ opacity: 1, y: 0, rotate: 0 }}
//                     exit={{ opacity: 0, y: 30 }}
//                     transition={{ duration: 0.8, delay: index * 0.2 }}
//                     whileHover={{ 
//                       y: -10, 
//                       scale: 1.03, 
//                       boxShadow: '0 15px 30px rgba(0,0,0,0.3)' 
//                     }}
//                   >
//                     <ProductCard product={product} />
//                   </motion.div>
//                 ))
//               ) : (
//                 Array.from({ length: 4 }).map((_, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 80, rotate: -8 }}
//                     animate={{ opacity: 1, y: 0, rotate: 0 }}
//                     transition={{ duration: 0.8, delay: index * 0.2 }}
//                     whileHover={{ 
//                       y: -10, 
//                       scale: 1.03, 
//                       boxShadow: '0 15px 30px rgba(0,0,0,0.3)' 
//                     }}
//                   >
//                     <ProductCard 
//                       product={{ 
//                         productId: index, 
//                         productName: `Product ${index + 1}`, 
//                         price: 29.99, 
//                         description: 'Lorem ipsum dolor sit amet.', 
//                         quantity: 10 
//                       }} 
//                     />
//                   </motion.div>
//                 ))
//               )}
//             </AnimatePresence>
//           </div>
//         </section>

//         {/* Categories */}
//         <section>
//           <motion.h2
//             initial={{ opacity: 0, x: 80 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.9 }}
//             className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 lg:mb-10"
//           >
//             Explore Categories
//           </motion.h2>
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
//             {['Electronics', 'Clothing', 'Home & Garden', 'Sports'].map((category, index) => (
//               <motion.div
//                 key={category}
//                 initial={{ opacity: 0, y: 80 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: index * 0.2 }}
//                 whileHover={{
//                   scale: 1.1,
//                   rotateX: 10,
//                   rotateY: 10,
//                   boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
//                   background: 'linear-gradient(135deg, #7c3aed, #db2777)',
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-xl shadow-lg overflow-hidden"
//               >
//                 <div className="h-36 sm:h-44 lg:h-52 flex items-center justify-center">
//                   <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center px-4">
//                     {category}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       </motion.div>
//     </div>
//   );
// };

// export default Home;