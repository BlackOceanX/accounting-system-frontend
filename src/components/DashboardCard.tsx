'use client';

import { useState } from 'react';
import { DashboardCardProps } from '@/types/dashboard';

const Chart = ({ type, color }: { type: string; color?: string }) => {
  switch (type) {
    case 'pie':
      return (
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#f3f6fa" />
          <path d="M50,10 A40,40 0 1,1 10,50" fill="none" stroke={color || '#38bdf8'} strokeWidth="20" />
        </svg>
      );
    case 'bar':
      return (
        <svg width="100" height="60" viewBox="0 0 100 60">
          <rect x="60" y="10" width="20" height="40" fill={color || '#38bdf8'} />
          <rect x="20" y="40" width="20" height="10" fill="#e5e7eb" />
        </svg>
      );
    case 'line':
      return (
        <svg width="200" height="60" viewBox="0 0 200 60">
          <polyline points="0,60 50,60 100,10 150,60 200,60" fill="none" stroke="#38bdf8" strokeWidth="3" />
          <polyline points="0,60 50,60 100,40 150,60 200,60" fill="none" stroke="#e91e63" strokeWidth="3" />
        </svg>
      );
    case 'doc':
      return (
        <svg width="60" height="60" viewBox="0 0 60 60">
          <rect x="10" y="10" width="40" height="50" rx="4" fill="#f3f6fa" />
          <rect x="18" y="20" width="24" height="4" fill="#cbd5e1" />
          <rect x="18" y="28" width="16" height="4" fill="#cbd5e1" />
        </svg>
      );
    default:
      return null;
  }
};

export function DashboardCard({ card }: DashboardCardProps) {
  const [selected, setSelected] = useState(card.filter[0]);

  // ฟังก์ชันย่อข้อความ
  const shorten = (text: string, max: number) => text.length > max ? text.slice(0, max - 1) + '…' : text;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col gap-4 min-h-[340px] h-[340px] border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg flex gap-2 items-center text-gray-800 truncate max-w-[60%]">
          <span title={card.title}>{shorten(card.title, 18)}</span>
          {card.link && (
            <a href="#" className="text-sky-600 text-xs hover:text-sky-700 transition-colors duration-200 underline ml-2 whitespace-nowrap truncate max-w-[100px]" title={card.link}>{shorten(card.link, 18)}</a>
          )}
        </div>
        <select
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all duration-200"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          {card.filter.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        {/* Value summary */}
        <div className="flex gap-6 text-base font-medium">
          <span className="text-gray-600">{card.valueLabel} <span className="text-sky-600 font-semibold">{card.value}</span></span>
          {card.valueLabel2 && (
            <span className="text-gray-600">{card.valueLabel2} <span className="text-gray-700 font-semibold">{card.value2}</span></span>
          )}
        </div>
        {/* Chart or Placeholder */}
        <div className="my-4 flex flex-col items-center">
          <Chart type={card.chartType} color={card.chartColor} />
        </div>
        {/* Chart label for pie */}
        {card.chartLabel && (
          <div className="flex gap-2 items-center text-pink-500 font-medium">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: card.chartColor }}></span>
            {card.chartLabel} <span className="ml-2">{card.chartValue}</span>
          </div>
        )}
        {/* Doc list for ยอดค้างจ่าย */}
        {card.docList && (
          <div className="w-full mt-2">
            <div className="flex justify-between text-xs text-gray-500 border-b pb-2 mb-2">
              <span>เอกสาร</span>
              <span>สถานะ</span>
            </div>
            {card.docList.map((doc) => (
              <div key={doc.code} className="flex justify-between items-center py-2 text-sm hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200">
                <div>
                  <div className="font-medium text-gray-800 truncate max-w-[120px]" title={doc.name}>{shorten(doc.name, 18)}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[120px]" title={doc.code + ' ครบกำหนด ' + doc.due}>{shorten(doc.code, 12)} ครบกำหนด {doc.due}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-gray-800">{doc.amount}</span>
                  <span className="text-xs bg-pink-100 text-pink-600 rounded-full px-3 py-1 mt-1 truncate max-w-[80px]" title={doc.status}>{shorten(doc.status, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Empty state */}
        {card.emptyText && !card.docList && (
          <div className="text-center text-gray-500 text-sm mt-2 truncate max-w-[220px] mx-auto" title={card.emptyText}>
            {shorten(card.emptyText, 40)}
          </div>
        )}
        {/* Button */}
        {card.button && !card.docList && (
          <button className="mt-2 px-4 py-2 border border-sky-400 text-sky-600 rounded-lg hover:bg-sky-50 hover:border-sky-500 transition-all duration-200 text-sm font-medium">
            {card.button}
          </button>
        )}
      </div>
    </div>
  );
} 