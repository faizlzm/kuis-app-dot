import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
      {children}
    </div>
  );
};

export default Card;