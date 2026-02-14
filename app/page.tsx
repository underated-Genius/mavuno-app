'use client';

import { useState, Suspense, lazy } from 'react';
import Header from '@/components/Header';
import { PriceSkeleton, WeatherSkeleton, ListingsSkeleton, InsightsSkeleton } from '@/components/ui/LoadingSkeletons';

// Lazy load components for better performance
const PriceDashboard = lazy(() => import('@/components/features/PriceDashboard'));
const WeatherDashboard = lazy(() => import('@/components/features/WeatherDashboard'));
const FarmerListings = lazy(() => import('@/components/features/FarmerListings'));
const Insights = lazy(() => import('@/components/features/Insights'));

export default function Home() {
  const [activeTab, setActiveTab] = useState('prices');

  const renderContent = () => {
    switch (activeTab) {
      case 'prices':
        return (
          <Suspense fallback={<PriceSkeleton />}>
            <PriceDashboard />
          </Suspense>
        );
      case 'weather':
        return (
          <Suspense fallback={<WeatherSkeleton />}>
            <WeatherDashboard />
          </Suspense>
        );
      case 'sell':
        return (
          <Suspense fallback={<ListingsSkeleton />}>
            <FarmerListings />
          </Suspense>
        );
      case 'insights':
        return (
          <Suspense fallback={<InsightsSkeleton />}>
            <Insights />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<PriceSkeleton />}>
            <PriceDashboard />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="section-container py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="section-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">About Mavuno</h3>
              <p className="text-sm text-muted-foreground">
                Kenya's leading agricultural intelligence platform, empowering farmers with real-time market data,
                weather forecasts, and AI-powered insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time market prices</li>
                <li>• Weather forecasts for 47 counties</li>
                <li>• Direct farmer connections</li>
                <li>• AI price predictions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: info@mavuno.co.ke<br />
                Phone: +254 700 000 000<br />
                Nairobi, Kenya
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mavuno Agricultural Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
