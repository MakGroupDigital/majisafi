import React from 'react';

// Dashboard Icon
export const DashboardIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

// Warehouse/Depot Icon
export const DepotIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 8h20M4 8v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8M4 8l8-5 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Stock/Package Icon
export const StockIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L3 7v10c0 2 1 4 9 6 8-2 9-4 9-6V7l-9-5z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    <path d="M12 12v6M8 14l4 2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Sales/Chart Icon
export const SalesIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 20h18V4H3v16z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M6 14l4-5 4 3 4-6M18 8h-3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Clients/Users Icon
export const ClientsIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M4 20c0-2.5 1.8-4 4-4s4 1.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M12 20c0-2.5 1.8-4 4-4s4 1.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Settings Icon
export const SettingsIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
    <path d="M12 4v2M12 18v2M4.22 4.22l1.41 1.41M17.37 17.37l1.41 1.41M4 12h2M18 12h2M4.22 19.78l1.41-1.41M17.37 6.63l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Logout Icon
export const LogoutIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Menu Icon
export const MenuIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Close Icon
export const CloseIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Stats Icons for dashboard cards
export const WarehouseStatsIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M4 12h24M6 12v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V12M6 12l10-6 10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M12 16v6M20 16v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const StockStatsIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M4 2l12-2 12 2v12c0 3-2 6-12 8-10-2-12-5-12-8V2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    <path d="M16 14v8M10 18l6 3 6-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SalesStatsIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M2 26h28V4H2v22z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M6 18l5-7 5 4 8-8M26 10h-4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClientsStatsIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M4 24c0-3 2-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="22" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M16 24c0-3 2-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
// Logistics/Truck Icon
export const LogisticsIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 18H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
  </svg>
);