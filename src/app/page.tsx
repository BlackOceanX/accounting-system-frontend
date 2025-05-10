"use client";
import Image from "next/image";
import { useState, Suspense } from "react";
import { DashboardCard } from '@/components/DashboardCard';
import { dashboardCards } from '@/data/dashboard';

function DashboardGrid() {
  return (
    <>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 4 cards */}
        {dashboardCards.slice(0, 4).map((card) => (
          <DashboardCard key={card.title} card={card} />
        ))}
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 mt-6">
        {/* Line chart card */}
        <DashboardCard card={dashboardCards[4]} />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Last 2 cards */}
        {dashboardCards.slice(5).map((card) => (
          <DashboardCard key={card.title} card={card} />
        ))}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f6fa] p-4 sm:p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardGrid />
      </Suspense>
    </div>
  );
}
