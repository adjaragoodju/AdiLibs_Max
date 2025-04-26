import React from 'react';

const Logo = ({ className = '' }) => {
  return (
    <span
      className={`text-3xl font-bold ${className}`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      AdiLibs
    </span>
  );
};

export default Logo;
