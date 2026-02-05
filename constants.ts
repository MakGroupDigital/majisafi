
export const BRAND_COLORS = {
  deepRed: '#A32626',
  sourceBlue: '#0066CC',
  horizonBlue: '#2C5282',
  pureWhite: '#FFFFFF',
  slateGray: '#64748B'
};

export const BOTTLE_PRICES: Record<string, number> = {
  '33cl': 500,
  '75cl': 1200,
  '1L': 1800,
  '5L': 4500,
  '10L': 8500
};

export const MOCK_USER = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  avatar: 'https://picsum.photos/seed/user123/200/200',
  membership: 'Premium' as const
};
