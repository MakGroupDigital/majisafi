
import React from 'react';
import { BRAND_COLORS } from '../constants';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0066CC] to-[#2C5282] rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <img 
          src="/Logo.jpeg" 
          alt="Maji Safi Ya Kuetu" 
          className="w-full h-full object-cover rounded-full transform transition-transform group-hover:scale-110 border-2 border-[#0066CC]/20"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight leading-none text-slate-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
          MAJI SAFI
        </span>
        <span 
          className="text-[10px] font-light uppercase" 
          style={{ 
            color: BRAND_COLORS.deepRed, 
            letterSpacing: '0.2em',
            fontFamily: 'Helvetica, Arial, sans-serif'
          }}
        >
          YA KUETU
        </span>
      </div>
    </div>
  );
};

export default Logo;
