import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Rate } from 'antd';
import '../styles/Testimonials.css'; // Import du fichier CSS séparé



const testimonials = [
  {
    name: "Sophie Martin",
    role: "Cliente fidèle",
    comment: "J'adore faire mes achats ici. Service exceptionnel!",
    rating: 5
  },
  {
    name: "Arnaud Yoboue",
    role: "Passionné de tech",
    comment: "Sélection impressionnante de produits tech.",
    rating: 4
  },
  {
    name: "Julie Leroy",
    role: "Acheteuse régulière",
    comment: "Je suis cliente depuis 2 ans, jamais déçue.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <div className="testimonials-container">
      <div className="testimonials-wrapper">
        <h2 className="testimonials-title">Ce que disent nos clients</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ clickable: true }}
          autoplay={{ 
            delay: 3000,
            disableOnInteraction: false
          }}
          loop={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="testimonials-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <Rate disabled defaultValue={testimonial.rating} />
                </div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <div className="testimonial-footer">
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;