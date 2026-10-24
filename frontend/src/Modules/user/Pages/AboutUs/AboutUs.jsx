import React from 'react';


import backgroundImage from '../AboutUs/bg_1.jpeg';
import aboutImage from '../AboutUs/about-1.jfif'; // Image to be placed on the left
import '../AboutUs/about.css'; // Your CSS file for styling


export default function AboutUs() {
  return (
    <div className="about-container">
      <h1 className="about-heading">About Us</h1>
      <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
        <div className="about-content">
          <div className="image-content">
            <img src={aboutImage} alt="About Us" />
          </div>
         
          <div className="text-content">
            <h2>Welcome to Dining Dynamics Restaurant</h2>
            <h1 style={{ fontFamily: 'Georgia, serif' }}>Experience the Taste of Elegance</h1>
            <p>
              At Pacific Restaurant, we believe that dining is more than just eating; it's an experience. 
              Our passion for culinary excellence is reflected in every dish we serve. 
              Whether you're here for a casual meal with friends or a special celebration, we strive to make your visit memorable.
            </p>
          </div>
        </div>
        <div className="additional-content">
          <h1>"Good food is the foundation of genuine happiness."</h1>
          <p>
            Our chefs use the freshest ingredients to craft dishes that not only satisfy your hunger but also delight your senses. 
            From farm to table, our commitment to quality and sustainability is evident in every bite. Join us and discover 
            the perfect blend of flavors and hospitality that makes Pacific Restaurant a dining destination.
          </p>

          <h2>- Pacific Restaurant Team</h2>
        </div>
    </div>
  );
}
