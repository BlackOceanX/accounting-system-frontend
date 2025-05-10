"use client";
import Image from "next/image";
import { useState, Suspense } from "react";
import { DashboardCard } from '@/components/DashboardCard';
import { dashboardCards } from '@/data/dashboard';

function DashboardGrid() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your financial overview</p>
      </div>

      {/* Top 4 cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.slice(0, 4).map((card) => (
          <div key={card.title} className="transform transition-all duration-300 hover:scale-[1.02]">
            <DashboardCard card={card} />
          </div>
        ))}
      </div>

      {/* Line chart card */}
      <div className="max-w-7xl mx-auto">
        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <DashboardCard card={dashboardCards[4]} />
        </div>
      </div>

      {/* Last 2 cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.slice(5).map((card) => (
          <div key={card.title} className="transform transition-all duration-300 hover:scale-[1.02]">
            <DashboardCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f6fa] to-[#eef2f7] p-4 sm:p-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
      }>
        <DashboardGrid />
      </Suspense>
    </div>
  );
}
