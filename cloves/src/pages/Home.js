import React from 'react';
import img001 from './../assets/karafuu1.jpeg';
import img002 from './../assets/karafuu2.jpeg';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6 text-center">
        Welcome Renter To ZCFRM System
      </h1>

      <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
        <img
          src={img002}
          alt="ZCFRMS Image 1"
          className="w-full max-w-4xl object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <img
          src={img001}
          alt="ZCFRMS Image 2"
          className="w-full max-w-2xl object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default Home;
