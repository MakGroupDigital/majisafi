
import React from 'react';
import { BRAND_COLORS } from '../constants';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0066CC] to-[#11b0c9] rounded-full opacity-15 group-hover:opacity-25 transition-opacity"></div>
        <img 
          src="/Logo.jpeg" 
          alt="Maji Safi Ya Kwetu" 
          className="w-full h-full object-cover rounded-full transform transition-transform group-hover:scale-110 border-2 border-[#0066CC]/30 shadow-md"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[22px] font-semibold tracking-tight leading-none text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          MAJI SAFI
        </span>
        <span 
          className="text-[10px] font-medium uppercase" 
          style={{ 
            color: BRAND_COLORS.deepRed, 
            letterSpacing: '0.28em',
            fontFamily: "'Outfit', sans-serif"
          }}
        >
          YA KWETU
        </span>
      </div>
    </div>
  );
};

export default Logo;
