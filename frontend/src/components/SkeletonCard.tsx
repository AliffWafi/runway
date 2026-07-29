'use client';

import React from 'react';

export function SkeletonCard() {
  return (
    <div className="ticket-card h-[210px] bg-[#ebdbb2]/40 border-2 border-[#3c3836]/30 rounded-md flex flex-col justify-between animate-pulse select-none">
      {/* Top Header Skeleton */}
      <div className="bg-[#d5c4a1]/60 px-3 py-2.5 h-[62px] border-b border-dashed border-[#3c3836]/30 flex flex-col justify-center space-y-2">
        <div className="h-3.5 bg-[#3c3836]/25 rounded w-3/4 animate-pulse" />
        <div className="h-2.5 bg-[#3c3836]/15 rounded w-1/2 animate-pulse" />
      </div>

      {/* Middle Body Skeleton */}
      <div className="bg-[#ebdbb2]/30 px-3 py-2.5 h-[106px] flex flex-col justify-between">
        <div className="h-2.5 bg-[#3c3836]/15 rounded w-2/5 animate-pulse mt-1" />
        <div className="h-2 bg-[#3c3836]/10 rounded w-1/3 animate-pulse mb-1" />
      </div>

      {/* Bottom Status Banner Skeleton */}
      <div className="bg-[#3c3836]/20 h-[42px] px-3 py-2 border-t-1.5 border-[#3c3836]/30 flex items-center justify-between">
        <div className="h-3 bg-[#3c3836]/30 rounded w-2/3 animate-pulse" />
        <div className="w-3.5 h-3.5 rounded-full bg-[#3c3836]/20 animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
