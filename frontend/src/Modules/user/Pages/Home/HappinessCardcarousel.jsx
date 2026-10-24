// HappinessCardCarousel.jsx
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HappinessCard from './HappinessCard';
import Image from '../../Images/HappinesCard.jfif';
import { Box } from '@mui/material';

const HappinessCardCarousel = () => {
  const cards = [
    { title: 'Happiness Gift Card', price: '1,000', imgSrc: Image },
    { title: 'Happiness Gift Card', price: '2,500', imgSrc: Image },
    { title: 'Happiness Gift Card', price: '5,000', imgSrc: Image },
    { title: 'Happiness Gift Card', price: '5,000', imgSrc: Image },
  ];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    // centerMode: true,
    centerPadding: '0px', // Adjust the padding as needed
  };

  return (
    <Box sx={{ padding: '10px',mb:6 }}> {/* Adjust the outer padding as needed */}
      <Slider {...settings}>
        {cards.map((card, index) => (
          <Box key={index} sx={{ padding: '0 10px' }}> {/* Adjust the inner padding as needed */}
            <HappinessCard title={card.title} price={card.price} imgSrc={card.imgSrc} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HappinessCardCarousel;
