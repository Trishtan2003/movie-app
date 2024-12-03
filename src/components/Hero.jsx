// src/components/Hero.jsx

import React from "react";

const Hero = ({ title, imageUrl, description }) => {
  return (
    <div
      className="relative bg-cover bg-center h-96"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 p-4 flex flex-col justify-center h-full text-white">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-2">{description}</p>
      </div>
    </div>
  );
};

export default Hero;
