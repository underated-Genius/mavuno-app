'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';
import { generateMarketPrices, generatePriceHistory, MARKETS, CROPS } from '@/lib/dummyData';
import { formatCurrency, getTrendIcon } from '@/lib/utils';

export default function PriceDashboard() {
  const [selectedMarket, setSelectedMarket] = useState<string>('Nairobi');
  const [selectedCrop, setSelectedCrop] = useState<string>('Maize');
  const [searchQuery, setSearchQuery] = useState('');

  const marketPrices = useMemo(() => generateMarketPrices(), []);
  const priceHistory = useMemo(() => generatePriceHistory(selectedCrop, selectedMarket), [selectedCrop, selectedMarket]);

  const filteredPrices = useMemo(() => {
    return marketPrices.filter(
      (price) =>
        price.market === selectedMarket &&
        (searchQuery === '' || price.crop.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [marketPrices, selectedMarket, searchQuery]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-display mb-2">Market Prices</h2>
        <p className="text-muted-foreground">Real-time agricultural commodity prices across major Kenyan markets</p>
      </div>

      {/* Market Selection */}
      <div className="flex flex-wrap gap-2">
        {MARKETS.map((market) => (
          <button
            key={market}
            onClick={() => setSelectedMarket(market)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedMarket === market
                ? 'bg-mavuno-500 text-white shadow-lg'
                : 'bg-card text-foreground hover:bg-muted border border-border'
            }`}
          >
            {market}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search crops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-mavuno-500"
        />
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrices.map((price) => (
          <div
            key={`${price.market}-${price.crop}`}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedCrop(price.crop)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{price.crop}</h3>
                <p className="text-xs text-muted-foreground">per {price.unit}</p>
              </div>
              <div className={`flex items-center gap-1 ${getTrendColor(price.trend)}`}>
                {getTrendIcon(price.trend)}
                <span className="text-sm font-medium">{Math.abs(price.change).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{formatCurrency(price.price)}</div>
              <div className="text-sm text-muted-foreground">
                Previous: {formatCurrency(price.previousPrice)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No crops found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Price Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          {selectedCrop} Price Trend - {selectedMarket}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `KES ${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-KE')}
                formatter={(value: number) => [formatCurrency(value), 'Price']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6 }}
                name="Price (KES)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
