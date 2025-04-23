import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, ShoppingCart, Tag, Percent, Gem, 
  CreditCard, Package, Gift, Award, Ticket,
  Shield, Clock, Star, Heart, Zap, 
  DollarSign, Scissors, Home, MapPin, Users,
  Truck, RefreshCw, ShoppingBasket, BarChart2, Bell,
  Bookmark, Camera, Headphones, Smartphone, Watch
} from 'lucide-react';

const AnimatedBackground = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  // E-commerce themed icons with fixed positions
  const icons = [
    { id: 1, x: '10%', y: '85%', size: 32, type: 'bag', color: 'rgba(255,255,255,0.8)' },
    { id: 2, x: '85%', y: '60%', size: 28, type: 'cart', color: 'rgba(255,255,255,0.7)' },
    { id: 3, x: '50%', y: '15%', size: 24, type: 'tag', color: 'rgba(255,255,255,0.6)' },
    { id: 4, x: '25%', y: '40%', size: 36, type: 'sale', color: 'rgba(255,255,255,0.9)' },
    { id: 5, x: '75%', y: '25%', size: 40, type: 'gem', color: 'rgba(255,255,255,1)' },
    { id: 6, x: '90%', y: '75%', size: 22, type: 'card', color: 'rgba(255,255,255,0.6)' },
    { id: 7, x: '15%', y: '30%', size: 26, type: 'package', color: 'rgba(255,255,255,0.7)' },
    { id: 8, x: '40%', y: '70%', size: 34, type: 'gift', color: 'rgba(255,255,255,0.8)' },
    { id: 9, x: '60%', y: '90%', size: 30, type: 'award', color: 'rgba(255,255,255,0.7)' },
    { id: 10, x: '80%', y: '15%', size: 28, type: 'ticket', color: 'rgba(255,255,255,0.6)' },
    { id: 11, x: '20%', y: '55%', size: 24, type: 'shield', color: 'rgba(255,255,255,0.6)' },
    { id: 12, x: '65%', y: '45%', size: 32, type: 'clock', color: 'rgba(255,255,255,0.7)' },
    { id: 13, x: '35%', y: '20%', size: 28, type: 'star', color: 'rgba(255,255,255,0.8)' },
    { id: 14, x: '55%', y: '65%', size: 26, type: 'heart', color: 'rgba(255,255,255,0.7)' },
    { id: 15, x: '45%', y: '85%', size: 30, type: 'truck', color: 'rgba(255,255,255,0.8)' },
    { id: 16, x: '30%', y: '75%', size: 24, type: 'phone', color: 'rgba(255,255,255,0.6)' },
    { id: 17, x: '70%', y: '35%', size: 36, type: 'headphones', color: 'rgba(255,255,255,0.9)' },
    { id: 18, x: '5%', y: '50%', size: 22, type: 'watch', color: 'rgba(255,255,255,0.5)' },
    { id: 19, x: '95%', y: '40%', size: 28, type: 'camera', color: 'rgba(255,255,255,0.7)' },
    { id: 20, x: '50%', y: '50%', size: 20, type: 'basket', color: 'rgba(255,255,255,0.5)' },
  ];

  const iconComponents = {
    bag: ShoppingBag,
    cart: ShoppingCart,
    tag: Tag,
    sale: Percent,
    gem: Gem,
    card: CreditCard,
    package: Package,
    gift: Gift,
    award: Award,
    ticket: Ticket,
    shield: Shield,
    clock: Clock,
    star: Star,
    heart: Heart,
    zap: Zap,
    dollar: DollarSign,
    truck: Truck,
    phone: Smartphone,
    headphones: Headphones,
    watch: Watch,
    camera: Camera,
    basket: ShoppingBasket
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.3,
      opacity: 1,
      color: 'rgba(255,255,255,1)',
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const floatingVariants = {
    float: {
      y: ["0%", "-10%", "0%"],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
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
          variants={pulseVariants}
          animate="animate"
        />
      </motion.div>

      {/* Floating Circles */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full bg-white/5"
          style={{
            width: `${100 + i * 100}px`,
            height: `${100 + i * 100}px`,
            left: `${i * 20}%`,
            top: `${i * 15}%`,
          }}
          variants={floatingVariants}
          animate="float"
        />
      ))}

      {/* E-commerce Icons */}
      <div className="absolute inset-0">
        {icons.map((icon) => {
          const IconComponent = iconComponents[icon.type];
          return (
            <motion.div
              key={icon.id}
              className="absolute cursor-pointer pointer-events-auto"
              style={{
                left: icon.x,
                top: icon.y,
                color: icon.color,
              }}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={iconVariants}
              onMouseEnter={() => setHoveredItem(icon.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <IconComponent size={icon.size} />
              {hoveredItem === icon.id && (
                <motion.div 
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap text-white/90 bg-black/30 px-2 py-1 rounded"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {icon.type.toUpperCase()}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={`grid-${i}`}
            className="absolute top-0 bottom-0 border-l border-white"
            style={{ left: `${(i / 15) * 100}%` }}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`grid-h-${i}`}
            className="absolute left-0 right-0 border-t border-white"
            style={{ top: `${(i / 10) * 100}%` }}
          />
        ))}
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
    </div>
  );
};

export default AnimatedBackground;








// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { ShoppingBag, ShoppingCart, Tag, Percent, Gem } from 'lucide-react';

// const AnimatedBackground = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [hoveredItem, setHoveredItem] = useState(null);

//   // Track mouse movement for parallax effect
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({
//         x: (e.clientX / window.innerWidth - 0.5) * 40, // Increased parallax effect
//         y: (e.clientY / window.innerHeight - 0.5) * 40,
//       });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // Shopping-themed icons with different types
//   const icons = [
//     { id: 1, x: '15%', y: '85%', size: 36, type: 'bag', color: '#a855f7' },
//     { id: 2, x: '82%', y: '55%', size: 28, type: 'cart', color: '#ec4899' },
//     { id: 3, x: '50%', y: '15%', size: 24, type: 'tag', color: '#4f46e5' },
//     { id: 4, x: '25%', y: '40%', size: 32, type: 'sale', color: '#10b981' },
//     { id: 5, x: '75%', y: '25%', size: 40, type: 'gem', color: '#f59e0b' },
//     { id: 6, x: '90%', y: '75%', size: 22, type: 'bag', color: '#ef4444' },
//   ];

//   const iconComponents = {
//     bag: ShoppingBag,
//     cart: ShoppingCart,
//     tag: Tag,
//     sale: Percent,
//     gem: Gem
//   };

//   const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         when: "beforeChildren"
//       }
//     }
//   };

//   const iconVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i) => ({
//       opacity: [0.4, 0.8, 0.4],
//       y: [0, getRandomFloat(-10, 10), 0],
//       scale: [1, getRandomFloat(1.1, 1.3), 1],
//       rotate: [0, getRandomFloat(-5, 5), 0],
//       transition: {
//         duration: getRandomFloat(3, 6),
//         repeat: Infinity,
//         ease: "easeInOut",
//         delay: i * 0.3
//       }
//     }),
//     hover: {
//       scale: 1.5,
//       opacity: 1,
//       transition: { duration: 0.3 }
//     }
//   };

//   const pulseVariants = {
//     animate: {
//       scale: [1, 1.2, 1],
//       opacity: [0.2, 0.5, 0.2],
//       transition: {
//         duration: 4,
//         repeat: Infinity,
//         ease: 'easeInOut'
//       }
//     }
//   };

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
//       {/* Animated Gradient Background */}
//       <motion.div
//         className="absolute inset-0"
//         initial={{ opacity: 0 }}
//         animate={{
//           opacity: 1,
//           background: [
//             'linear-gradient(135deg, #4f46e5, #a855f7, #ec4899)',
//             'linear-gradient(135deg, #a855f7, #ec4899, #4f46e5)',
//             'linear-gradient(135deg, #ec4899, #4f46e5, #a855f7)',
//           ],
//         }}
//         transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
//       />

//       {/* Floating Circles */}
//       {[1, 2, 3, 4].map((i) => (
//         <motion.div
//           key={`circle-${i}`}
//           className={`absolute rounded-full ${i % 2 ? 'bg-white/10' : 'bg-white/5'}`}
//           style={{
//             width: `${getRandomFloat(100, 300)}px`,
//             height: `${getRandomFloat(100, 300)}px`,
//             left: `${getRandomFloat(0, 100)}%`,
//             top: `${getRandomFloat(0, 100)}%`,
//           }}
//           variants={pulseVariants}
//           animate="animate"
//         />
//       ))}

//       {/* Shopping Icons */}
//       <motion.div 
//         className="absolute inset-0"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {icons.map((icon, i) => {
//           const IconComponent = iconComponents[icon.type];
//           return (
//             <motion.div
//               key={icon.id}
//               className="absolute cursor-pointer pointer-events-auto"
//               style={{
//                 left: icon.x,
//                 top: icon.y,
//                 color: icon.color,
//                 transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
//               }}
//               custom={i}
//               variants={iconVariants}
//               onMouseEnter={() => setHoveredItem(icon.id)}
//               onMouseLeave={() => setHoveredItem(null)}
//               whileHover="hover"
//             >
//               <IconComponent size={icon.size} />
//               {hoveredItem === icon.id && (
//                 <motion.div 
//                   className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap"
//                   initial={{ opacity: 0, y: 5 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 5 }}
//                 >
//                   {icon.type.toUpperCase()}
//                 </motion.div>
//               )}
//             </motion.div>
//           );
//         })}
//       </motion.div>

//       {/* Animated Grid Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         {Array.from({ length: 20 }).map((_, i) => (
//           <React.Fragment key={`line-${i}`}>
//             <motion.div 
//               className="absolute top-0 bottom-0 bg-white"
//               style={{ left: `${(i / 20) * 100}%`, width: '1px' }}
//               animate={{ height: ['0%', '100%', '0%'] }}
//               transition={{ duration: 15, delay: i * 0.2, repeat: Infinity }}
//             />
//             <motion.div 
//               className="absolute left-0 right-0 bg-white"
//               style={{ top: `${(i / 20) * 100}%`, height: '1px' }}
//               animate={{ width: ['0%', '100%', '0%'] }}
//               transition={{ duration: 15, delay: i * 0.2, repeat: Infinity }}
//             />
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Subtle Overlay for Contrast */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20" />
//     </div>
//   );
// };

// export default AnimatedBackground;