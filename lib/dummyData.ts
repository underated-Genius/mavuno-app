// Kenyan Agricultural Markets Data
export const MARKETS = [
  'Nairobi',
  'Kisumu',
  'Mombasa',
  'Eldoret',
  'Nakuru',
  'Meru',
] as const;

export const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans-Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
] as const;

export const CROPS = [
  'Maize', 'Beans', 'Potatoes', 'Tomatoes', 'Onions', 'Cabbage',
  'Sukuma Wiki', 'Carrots', 'Bananas', 'Coffee', 'Tea', 'Avocado',
  'Mango', 'Wheat', 'Rice', 'Sorghum', 'Millet', 'Cassava',
] as const;

// Market Prices (KES per kg)
export interface MarketPrice {
  crop: string;
  market: string;
  price: number;
  previousPrice: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  unit: string;
}

export const generateMarketPrices = (): MarketPrice[] => {
  const prices: MarketPrice[] = [];
  const basePrices: Record<string, number> = {
    'Maize': 45,
    'Beans': 120,
    'Potatoes': 55,
    'Tomatoes': 70,
    'Onions': 65,
    'Cabbage': 35,
    'Sukuma Wiki': 25,
    'Carrots': 60,
    'Bananas': 50,
    'Coffee': 450,
    'Tea': 380,
    'Avocado': 80,
    'Mango': 45,
    'Wheat': 55,
    'Rice': 130,
    'Sorghum': 50,
    'Millet': 48,
    'Cassava': 40,
  };

  MARKETS.forEach(market => {
    CROPS.forEach(crop => {
      const basePrice = basePrices[crop] || 50;
      const marketMultiplier = market === 'Nairobi' ? 1.15 : market === 'Mombasa' ? 1.1 : market === 'Kisumu' ? 0.95 : 1.0;
      const variance = (Math.random() - 0.5) * 0.2;
      const price = Math.round(basePrice * marketMultiplier * (1 + variance));
      const previousPrice = Math.round(price * (1 + (Math.random() - 0.5) * 0.1));
      const change = ((price - previousPrice) / previousPrice) * 100;

      prices.push({
        crop,
        market,
        price,
        previousPrice,
        change: Math.round(change * 10) / 10,
        trend: change > 1 ? 'up' : change < -1 ? 'down' : 'stable',
        lastUpdated: new Date().toISOString(),
        unit: 'kg',
      });
    });
  });

  return prices;
};

// Historical Price Data for Charts
export interface PriceHistory {
  date: string;
  price: number;
}

export const generatePriceHistory = (crop: string, market: string, days: number = 30): PriceHistory[] => {
  const history: PriceHistory[] = [];
  const basePrices: Record<string, number> = {
    'Maize': 45,
    'Beans': 120,
    'Potatoes': 55,
    'Tomatoes': 70,
    'Onions': 65,
    'Cabbage': 35,
  };
  
  let currentPrice = basePrices[crop] || 50;
  const marketMultiplier = market === 'Nairobi' ? 1.15 : market === 'Mombasa' ? 1.1 : 1.0;
  currentPrice *= marketMultiplier;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const variance = (Math.random() - 0.5) * 0.15;
    currentPrice = currentPrice * (1 + variance);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice * 10) / 10,
    });
  }

  return history;
};

// Price Predictions
export interface PricePrediction {
  date: string;
  predicted: number;
  confidence: number;
}

export const generatePricePredictions = (currentPrice: number): PricePrediction[] => {
  const predictions: PricePrediction[] = [];
  let price = currentPrice;

  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const trend = 0.02; // Slight upward trend
    const variance = (Math.random() - 0.5) * 0.1;
    price = price * (1 + trend + variance);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      predicted: Math.round(price * 10) / 10,
      confidence: Math.max(50, 95 - i * 5), // Decreasing confidence over time
    });
  }

  return predictions;
};

// Weather Data
export interface WeatherData {
  county: string;
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  forecast: string;
  advisory: string;
}

export const generateWeatherData = (): WeatherData[] => {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear'];
  const advisories = [
    'Ideal conditions for planting maize. Ensure adequate irrigation.',
    'Good weather for harvesting. Dry crops thoroughly before storage.',
    'Heavy rains expected. Prepare drainage systems and delay planting.',
    'Perfect weather for tea picking. Maintain optimal moisture levels.',
    'Drought conditions. Implement water conservation measures.',
  ];

  return COUNTIES.map(county => ({
    county,
    temperature: Math.round(18 + Math.random() * 15),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.round(40 + Math.random() * 50),
    rainfall: Math.round(Math.random() * 30 * 10) / 10,
    windSpeed: Math.round(5 + Math.random() * 15),
    forecast: Math.random() > 0.5 ? 'Rain expected in next 48 hours' : 'Clear skies for next 3 days',
    advisory: advisories[Math.floor(Math.random() * advisories.length)],
  }));
};

// Farmer Listings
export interface FarmerListing {
  id: string;
  farmerName: string;
  county: string;
  crop: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  phone: string;
  description: string;
  availableFrom: string;
  organic: boolean;
}

export const generateFarmerListings = (): FarmerListing[] => {
  const farmers = [
    'John Kamau', 'Mary Wanjiku', 'Peter Omondi', 'Grace Achieng', 'David Kipchoge',
    'Sarah Njeri', 'James Mutua', 'Ann Chebet', 'Samuel Otieno', 'Jane Wambui',
    'Joseph Kiprotich', 'Lucy Nyambura', 'Daniel Mwangi', 'Faith Chepkoech', 'Robert Odhiambo',
  ];

  return Array.from({ length: 20 }, (_, i) => ({
    id: `listing-${i + 1}`,
    farmerName: farmers[Math.floor(Math.random() * farmers.length)],
    county: COUNTIES[Math.floor(Math.random() * COUNTIES.length)],
    crop: CROPS[Math.floor(Math.random() * CROPS.length)],
    quantity: Math.round(100 + Math.random() * 2000),
    unit: 'kg',
    pricePerUnit: Math.round(30 + Math.random() * 150),
    phone: `+254${Math.floor(700000000 + Math.random() * 99999999)}`,
    description: 'High quality produce, freshly harvested. Available for immediate delivery to Nairobi and surrounding areas.',
    availableFrom: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    organic: Math.random() > 0.5,
  }));
};

// Agricultural News
export interface NewsItem {
  id: string;
  title: string;
  category: 'policy' | 'fuel' | 'climate' | 'subsidy';
  content: string;
  date: string;
  source: string;
}

export const AGRICULTURAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Government Announces KES 5 Billion Fertilizer Subsidy Program',
    category: 'subsidy',
    content: 'The Ministry of Agriculture has launched a new fertilizer subsidy program targeting 2 million smallholder farmers across Kenya. Farmers will access subsidized fertilizer at KES 3,500 per 50kg bag, down from the current market price of KES 6,500.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'Ministry of Agriculture',
  },
  {
    id: 'news-2',
    title: 'Fuel Prices Drop by KES 5 per Liter, Transportation Costs Expected to Decrease',
    category: 'fuel',
    content: 'The Energy and Petroleum Regulatory Authority (EPRA) has announced a reduction in fuel prices. Super Petrol will retail at KES 192.84, Diesel at KES 178.70, and Kerosene at KES 168.19 per liter in Nairobi.',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'EPRA',
  },
  {
    id: 'news-3',
    title: 'Climate Change Advisory: Long Rains Expected in March-May Period',
    category: 'climate',
    content: 'Kenya Meteorological Department forecasts above-average rainfall during the March-April-May season. Farmers in the Central Highlands and Western regions are advised to prepare for planting season and implement proper drainage systems.',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'Kenya Met Department',
  },
  {
    id: 'news-4',
    title: 'New Agricultural Policy to Support Small-Scale Farmers with Technology',
    category: 'policy',
    content: 'The government has unveiled a digital agriculture policy aimed at connecting farmers to markets through technology platforms. The initiative includes provision of smartphones and training for 500,000 farmers nationwide.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'Ministry of Agriculture',
  },
  {
    id: 'news-5',
    title: 'Diesel Subsidy Extended for Agricultural Machinery Operators',
    category: 'fuel',
    content: 'The Treasury has extended the diesel subsidy for agricultural machinery operators by another six months. Registered farmers can now access diesel at subsidized rates for tractors and irrigation pumps.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'National Treasury',
  },
];

// Best Selling Recommendations
export interface SellRecommendation {
  crop: string;
  recommendedMarket: string;
  bestPrice: number;
  reason: string;
  demandLevel: 'high' | 'medium' | 'low';
}

export const generateSellRecommendations = (crop: string): SellRecommendation[] => {
  const marketPrices = generateMarketPrices().filter(p => p.crop === crop);
  const sorted = marketPrices.sort((a, b) => b.price - a.price);

  return sorted.slice(0, 3).map((mp, index) => ({
    crop,
    recommendedMarket: mp.market,
    bestPrice: mp.price,
    reason: index === 0
      ? `Highest current price due to strong demand and limited supply`
      : index === 1
      ? `Good price with consistent demand. Lower transportation costs than top market`
      : `Stable market with reliable buyers. Good alternative for bulk sales`,
    demandLevel: index === 0 ? 'high' : index === 1 ? 'medium' : 'medium',
  }));
};
