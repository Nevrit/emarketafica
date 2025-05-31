import React from 'react';
import HeroBanner from './HeroBanner';
import CategoriesSection from './CategoriesSection';
import ProductsSection from './ProductsSection';
import PromoSection from './PromoSection';
import StatsSection from './StatsSection';
import Testimonials from './Testimonials';
import Newsletter from './Newsletter';

const MainContent: React.FC = () => {
  return (
    <>
      <HeroBanner />
      <CategoriesSection />
      <ProductsSection title="Tous les produits" />
      <PromoSection />
      <StatsSection />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default MainContent;