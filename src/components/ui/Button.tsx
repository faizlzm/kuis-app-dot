import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'link';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', fullWidth, ...props }) => {
  const baseStyle = "py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500";
      break;
    case 'secondary':
      variantStyle = "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";
      break;
    case 'danger':
      variantStyle = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      break;
    case 'link':
        variantStyle = "bg-transparent text-indigo-600 hover:text-indigo-800 focus:ring-indigo-500 underline";
        break;
  }

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button className={`${baseStyle} ${variantStyle} ${widthStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;