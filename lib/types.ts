export type Market = 'Nairobi' | 'Kisumu' | 'Mombasa' | 'Eldoret' | 'Nakuru' | 'Meru';

export type Crop = 
  | 'Maize' | 'Beans' | 'Potatoes' | 'Tomatoes' | 'Onions' | 'Cabbage'
  | 'Sukuma Wiki' | 'Carrots' | 'Bananas' | 'Coffee' | 'Tea' | 'Avocado'
  | 'Mango' | 'Wheat' | 'Rice' | 'Sorghum' | 'Millet' | 'Cassava';

export type NewsCategory = 'policy' | 'fuel' | 'climate' | 'subsidy';

export type Trend = 'up' | 'down' | 'stable';

export type DemandLevel = 'high' | 'medium' | 'low';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
