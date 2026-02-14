'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Phone, Package, Calendar, CheckCircle } from 'lucide-react';
import { generateFarmerListings } from '@/lib/dummyData';
import { formatCurrency, formatDate, generateWhatsAppLink } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function FarmerListings() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');

  const listings = useMemo(() => generateFarmerListings(), []);

  const crops = useMemo(() => {
    const uniqueCrops = [...new Set(listings.map((l) => l.crop))];
    return uniqueCrops.sort();
  }, [listings]);

  const counties = useMemo(() => {
    const uniqueCounties = [...new Set(listings.map((l) => l.county))];
    return uniqueCounties.sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch =
        searchQuery === '' ||
        listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.farmerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCrop = selectedCrop === 'all' || listing.crop === selectedCrop;
      const matchesCounty = selectedCounty === 'all' || listing.county === selectedCounty;

      return matchesSearch && matchesCrop && matchesCounty;
    });
  }, [listings, searchQuery, selectedCrop, selectedCounty]);

  const handleWhatsAppContact = (listing: typeof listings[0]) => {
    if (!user) {
      alert('Please sign in to contact farmers');
      return;
    }

    const message = `Hello ${listing.farmerName}, I'm interested in your ${listing.crop} listing (${listing.quantity}${listing.unit} at ${formatCurrency(listing.pricePerUnit)}/${listing.unit}). Is this still available?`;
    const whatsappUrl = generateWhatsAppLink(listing.phone, message);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-display mb-2">Farmer Marketplace</h2>
        <p className="text-muted-foreground">Connect directly with farmers across Kenya via WhatsApp</p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by crop, county, or farmer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-mavuno-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-mavuno-500"
          >
            <option value="all">All Crops</option>
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>

          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-mavuno-500"
          >
            <option value="all">All Counties</option>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-xl mb-1">{listing.crop}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.county}</span>
                </div>
              </div>
              {listing.organic && (
                <div className="bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">Organic</span>
                  </div>
                </div>
              )}
            </div>

            {/* Farmer Info */}
            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium mb-1">Farmer</div>
              <div className="text-muted-foreground">{listing.farmerName}</div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-xs">Quantity</span>
                </div>
                <div className="font-semibold">
                  {listing.quantity.toLocaleString()} {listing.unit}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Available From</span>
                </div>
                <div className="font-semibold">{formatDate(listing.availableFrom)}</div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-mavuno-500/10 border border-mavuno-500/20 rounded-lg p-3 mb-4">
              <div className="text-xs text-muted-foreground mb-1">Price per {listing.unit}</div>
              <div className="text-2xl font-bold text-mavuno-700 dark:text-mavuno-400">
                {formatCurrency(listing.pricePerUnit)}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>

            {/* Contact Button */}
            <button
              onClick={() => handleWhatsAppContact(listing)}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Contact via WhatsApp
            </button>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No listings found matching your filters</p>
        </div>
      )}
    </div>
  );
}
