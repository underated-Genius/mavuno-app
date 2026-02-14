'use client';

export function PriceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-64" />
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-24 rounded-lg" />
        ))}
      </div>
      <div className="skeleton h-12 w-full rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <div className="skeleton h-6 w-24" />
              <div className="skeleton h-4 w-12" />
            </div>
            <div className="skeleton h-8 w-32" />
            <div className="skeleton h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-64" />
      <div className="skeleton h-12 w-full rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex justify-between">
              <div className="skeleton h-6 w-32" />
              <div className="skeleton h-8 w-16" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="skeleton h-12 w-full" />
              ))}
            </div>
            <div className="skeleton h-20 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-64" />
      <div className="skeleton h-12 w-full rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex justify-between">
              <div className="skeleton h-6 w-32" />
              <div className="skeleton h-6 w-16" />
            </div>
            <div className="skeleton h-16 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
            </div>
            <div className="skeleton h-16 w-full rounded-lg" />
            <div className="skeleton h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-8 w-64" />
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-80 w-full" />
      </div>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="skeleton h-6 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-24 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
