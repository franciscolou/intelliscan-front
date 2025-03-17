import React from 'react';

const BrandSignature: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full md:w-2/3 text-white mt-4 md:mt-0">
      <img
        src="/logo/logo_white.png"
        alt="Logo"
        className="h-24 md:h-48 mr-4 grayscale brightness-[1000%] contrast-[1000%]"
      />
      <div className="text-right">
        <h1 className="text-4xl md:text-8xl font-bold">
          Intelliscan<sup className="text-2xl md:text-4xl">®</sup>
        </h1>
        <p className="text-lg md:text-xl">Your AI partner for billing</p>
      </div>
    </div>
  );
};

export default BrandSignature;