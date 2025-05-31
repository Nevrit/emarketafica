import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Button } from 'antd';
import { banners } from '../data/banners';
import '../styles/HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        navigation
        loop
        className="hero-swiper"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div 
              className="hero-slide"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <h1 className="hero-title">{banner.title}</h1>
                <p className="hero-description">{banner.description}</p>
                <Button type="primary" size="large" className="hero-button">
                  {banner.buttonText}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner;