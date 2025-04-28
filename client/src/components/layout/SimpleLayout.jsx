// src/components/layout/SimpleLayout.jsx
import React from 'react';
import SimpleHeader from './SimpleHeader';
import SimpleFooter from './SimpleFooter';

const SimpleLayout = ({ children }) => {
  return (
    <>
      <SimpleHeader />
      <main className='container mx-auto px-6 py-12 mt-12'>{children}</main>
      <SimpleFooter />
    </>
  );
};

export default SimpleLayout;
