'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, Newspaper, Filter, Star, AlertCircle } from 'lucide-react';
import {
  generateMarketPrices,
  generatePricePredictions,
  generateSellRecommendations,
  AGRICULTURAL_NEWS,
  CROPS,
} from '@/lib/dummyData';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Insights() {
  const [selectedCrop, setSelectedCrop] = useState<string>('Maize');
  const [newsFilter, setNewsFilter] = useState<string>('all');

  const marketPrices = useMemo(() => generateMarketPrices(), []);
  const currentPrice = useMemo(() => {
    const price = marketPrices.find((p) => p.crop === selectedCrop && p.market === 'Nairobi');
    return price?.price || 50;
  }, [marketPrices, selectedCrop]);

  const predictions = useMemo(() => generatePricePredictions(currentPrice), [currentPrice]);
  const recommendations = useMemo(() => generateSellRecommendations(selectedCrop), [selectedCrop]);

  const filteredNews = useMemo(() => {
    if (newsFilter === 'all') return AGRICULTURAL_NEWS;
    return AGRICULTURAL_NEWS.filter((news) => news.category === newsFilter);
  }, [newsFilter]);

  const predictionChartData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return [
      { date: today, actual: currentPrice, predicted: null },
      ...predictions.map((p) => ({
        date: p.date,
        actual: null,
        predicted: p.predicted,
        confidence: p.confidence,
      })),
    ];
  }, [currentPrice, predictions]);

  const getDemandColor = (level: string) => {
    if (level === 'high') return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400';
    if (level === 'medium') return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400';
    return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400';
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'policy':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'fuel':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400';
      case 'climate':
        return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400';
      case 'subsidy':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-display mb-2">Agricultural Insights</h2>
        <p className="text-muted-foreground">AI-powered predictions and market intelligence</p>
      </div>

      {/* Price Predictions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-mavuno-500" />
            7-Day Price Forecast
          </h3>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-mavuno-500"
          >
            {CROPS.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {/* Prediction Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="h-80 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionChartData}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Price']}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#colorPredicted)"
                  name="Predicted Price"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', r: 5 }}
                  name="Current Price"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900 dark:text-blue-200 mb-1">AI Forecast</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                Prices for {selectedCrop} are expected to{' '}
                {predictions[predictions.length - 1].predicted > currentPrice ? 'increase' : 'decrease'} by{' '}
                {Math.abs(((predictions[predictions.length - 1].predicted - currentPrice) / currentPrice) * 100).toFixed(1)}%
                over the next 7 days. Model confidence: {predictions[0].confidence}%
              </div>
            </div>
          </div>
        </div>

        {/* Best Selling Recommendations */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Best Markets to Sell {selectedCrop}
          </h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={rec.recommendedMarket}
                className={`p-4 rounded-lg border ${
                  index === 0 ? 'bg-mavuno-500/10 border-mavuno-500/20' : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {index === 0 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      <span className="font-semibold">{rec.recommendedMarket}</span>
                    </div>
                    <div className="text-2xl font-bold text-mavuno-700 dark:text-mavuno-400 mt-1">
                      {formatCurrency(rec.bestPrice)}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDemandColor(rec.demandLevel)}`}>
                    {rec.demandLevel.toUpperCase()} DEMAND
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agricultural News Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-mavuno-500" />
            Agricultural News & Updates
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={newsFilter}
              onChange={(e) => setNewsFilter(e.target.value)}
              className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mavuno-500"
            >
              <option value="all">All News</option>
              <option value="policy">Policy</option>
              <option value="fuel">Fuel</option>
              <option value="climate">Climate</option>
              <option value="subsidy">Subsidy</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNews.map((news) => (
            <div key={news.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(news.category)}`}>
                  {news.category.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">{formatDate(news.date)}</div>
              </div>
              <h4 className="text-lg font-semibold mb-2">{news.title}</h4>
              <p className="text-muted-foreground mb-3">{news.content}</p>
              <div className="text-xs text-muted-foreground">Source: {news.source}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
