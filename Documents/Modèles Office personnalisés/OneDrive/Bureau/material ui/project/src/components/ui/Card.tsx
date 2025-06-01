import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  onClick
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-md overflow-hidden';
  const interactiveStyles = onClick || hoverEffect 
    ? 'cursor-pointer transition-transform duration-300 hover:-translate-y-1' 
    : '';
  
  return (
    <motion.div
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      whileHover={hoverEffect ? { scale: 1.03 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;