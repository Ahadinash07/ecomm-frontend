import { motion } from 'framer-motion';

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const linkVariants = {
  hover: {
    x: 5,
    color: '#93c5fd',
    transition: { duration: 0.3 },
  },
};

const Footer = () => {
  return (
    <motion.footer
      className="bg-gradient-to-r from-indigo-800 to-purple-900 text-white py-8 sm:py-12"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
          <motion.div
            className="mb-6 md:mb-0"
            variants={sectionVariants}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3">E-Commerce</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Your one-stop shop for everything
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <motion.div variants={sectionVariants}>
              <h4 className="font-semibold text-base sm:text-lg mb-3">Shop</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    All Products
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    New Arrivals
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    Featured
                  </motion.a>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={sectionVariants}>
              <h4 className="font-semibold text-base sm:text-lg mb-3">Help</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    Contact Us
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    FAQs
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    Shipping
                  </motion.a>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={sectionVariants}>
              <h4 className="font-semibold text-base sm:text-lg mb-3">Company</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    About Us
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    Careers
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="hover:text-blue-300"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    Privacy Policy
                  </motion.a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="border-t border-indigo-700 mt-8 pt-6 text-center"
          variants={sectionVariants}
        >
          <p className="text-gray-300 text-sm sm:text-base">
            © {new Date().getFullYear()} E-Commerce. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;





























// import { motion } from 'framer-motion';

// // Animation variants
// const footerVariants = {
//   hidden: { opacity: 0, y: 50 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.8,
//       when: 'beforeChildren',
//       staggerChildren: 0.2,
//     },
//   },
// };

// const sectionVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
// };

// const linkVariants = {
//   hover: {
//     x: 5,
//     color: '#93c5fd',
//     transition: { duration: 0.3 },
//   },
// };

// const Footer = () => {
//   return (
//     <motion.footer
//       className="bg-gradient-to-r from-indigo-800 to-purple-900 text-white py-8 sm:py-12"
//       variants={footerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
//         <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
//           {/* Brand Section */}
//           <motion.div
//             className="mb-6 md:mb-0"
//             variants={sectionVariants}
//           >
//             <h3 className="text-xl sm:text-2xl font-bold mb-3">E-Commerce</h3>
//             <p className="text-gray-300 text-sm sm:text-base">
//               Your one-stop shop for everything
//             </p>
//           </motion.div>

//           {/* Links Section */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
//             <motion.div variants={sectionVariants}>
//               <h4 className="font-semibold text-base sm:text-lg mb-3">Shop</h4>
//               <ul className="space-y-2 text-sm sm:text-base">
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     All Products
//                   </motion.a>
//                 </li>
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     New Arrivals
//                   </motion.a>
//                 </li>
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     Featured
//                   </motion.a>
//                 </li>
//               </ul>
//             </motion.div>

//             <motion.div variants={sectionVariants}>
//               <h4 className="font-semibold text-base sm:text-lg mb-3">Help</h4>
//               <ul className="space-y-2 text-sm sm:text-base">
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     Contact Us
//                   </motion.a>
//                 </li>
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     FAQs
//                   </motion.a>
//                 </li>
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     Shipping
//                   </motion.a>
//                 </li>
//               </ul>
//             </motion.div>

//             <motion.div variants={sectionVariants}>
//               <h4 className="font-semibold text-base sm:text-lg mb-3">Company</h4>
//               <ul className="space-y-2 text-sm sm:text-base">
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     About Us
//                   </motion.a>
//                 </li>
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     Careers
//                   </motion.a>
//                 </li>
//                 <li>
//                   <motion.a
//                     href="#"
//                     className="hover:text-blue-300"
//                     variants={linkVariants}
//                     whileHover="hover"
//                   >
//                     Privacy Policy
//                   </motion.a>
//                 </li>
//               </ul>
//             </motion.div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <motion.div
//           className="border-t border-indigo-700 mt-8 pt-6 text-center"
//           variants={sectionVariants}
//         >
//           <p className="text-gray-300 text-sm sm:text-base">
//             © {new Date().getFullYear()} E-Commerce. All rights reserved.
//           </p>
//         </motion.div>
//       </div>
//     </motion.footer>
//   );
// };

// export default Footer;