"use client";
import Image from "next/image";
import { useState } from "react";

const cards = [
  {
    title: "ยอดขายตามสินค้า",
    filter: ["3 เดือน", "6 เดือน", "1 ปี"],
    valueLabel: "รายได้รวม:",
    value: "0.00",
    chartType: "pie",
    emptyText: "ไม่พบข้อมูลในช่วงเวลานี้ กรุณาสร้างใบกำกับภาษีเพื่อดูว่ารายได้ของคุณมาจากไหน",
    button: "สร้างใบกำกับภาษี",
    link: "ดูยอดขายตามโปรเจ็ค"
  },
  {
    title: "สรุปยอดเก็บเงิน",
    filter: ["3 เดือน", "6 เดือน", "1 ปี"],
    valueLabel: "เก็บเงินแล้ว:",
    value: "0.00",
    valueLabel2: "รายได้รวม:",
    value2: "0.00",
    chartType: "bar",
    emptyText: "ไม่พบข้อมูลในช่วงเวลานี้ กรุณาสร้างใบกำกับภาษีเพื่อดูยอดที่เก็บเงินได้จากบิลที่เปิดทั้งหมด",
    button: "สร้างใบกำกับภาษี"
  },
  {
    title: "ค่าใช้จ่ายตามหมวดหมู่",
    filter: ["3 เดือน", "6 เดือน", "1 ปี"],
    valueLabel: "ค่าใช้จ่ายรวม:",
    value: "32,100.00",
    chartType: "pie",
    chartColor: "#e91e63",
    chartLabel: "ออฟฟิศ",
    chartValue: "32,100.00",
    link: "ดูค่าใช้จ่ายตามโปรเจ็ค"
  },
  {
    title: "สรุปยอดชำระเงิน",
    filter: ["3 เดือน", "6 เดือน", "1 ปี"],
    valueLabel: "ชำระเงินแล้ว:",
    value: "0.00",
    valueLabel2: "ค่าใช้จ่ายรวม:",
    value2: "32,100.00",
    chartType: "bar",
    chartColor: "#e91e63"
  },
  {
    title: "รายได้และค่าใช้จ่ายตามเอกสาร",
    filter: ["ปีปัจจุบัน", "ปีที่แล้ว"],
    valueLabel: "รายได้รวม:",
    value: "0.00",
    valueLabel2: "ค่าใช้จ่ายรวม:",
    value2: "32,100.00",
    chartType: "line"
  },
  {
    title: "ยอดค้างรับ",
    filter: ["1 ปี", "6 เดือน"],
    valueLabel: "ยอดค้างรับ:",
    value: "0.00",
    chartType: "doc",
    emptyText: "ไม่พบข้อมูลในช่วงเวลานี้ กรุณาสร้างใบกำกับภาษีเพื่อดูเอกสารที่ยังไม่ได้เก็บเงิน",
    button: "สร้างใบกำกับภาษี"
  },
  {
    title: "ยอดค้างจ่าย",
    filter: ["1 ปี", "6 เดือน"],
    valueLabel: "ยอดค้างจ่าย:",
    value: "32,100.00",
    chartType: "doc",
    docList: [
      {
        name: "บริษัท โฟลว์แอคเคาท์ จำกัด",
        code: "EXP202505100001",
        due: "10-05-2025",
        amount: "32,100.00",
        status: "รอดำเนินการ"
      }
    ]
  }
];

function DashboardCard({ card }: { card: any }) {
  const [selected, setSelected] = useState(card.filter[0]);
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 min-h-[320px]">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg flex gap-2 items-center">
          {card.title}
          {card.link && (
            <a href="#" className="text-sky-600 text-xs underline ml-2 whitespace-nowrap">{card.link}</a>
          )}
        </div>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          {card.filter.map((f: string) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        {/* Value summary */}
        <div className="flex gap-4 text-base font-medium">
          <span>{card.valueLabel} <span className="text-sky-600">{card.value}</span></span>
          {card.valueLabel2 && (
            <span>{card.valueLabel2} <span className="text-gray-700">{card.value2}</span></span>
          )}
        </div>
        {/* Chart or Placeholder */}
        <div className="my-4 flex flex-col items-center">
          {card.chartType === "pie" && (
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="#f3f6fa" />
              <path d="M50,10 A40,40 0 1,1 10,50" fill="none" stroke={card.chartColor || '#38bdf8'} strokeWidth="20" />
            </svg>
          )}
          {card.chartType === "bar" && (
            <svg width="100" height="60" viewBox="0 0 100 60">
              <rect x="60" y="10" width="20" height="40" fill={card.chartColor || '#38bdf8'} />
              <rect x="20" y="40" width="20" height="10" fill="#e5e7eb" />
            </svg>
          )}
          {card.chartType === "line" && (
            <svg width="200" height="60" viewBox="0 0 200 60">
              <polyline points="0,60 50,60 100,10 150,60 200,60" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <polyline points="0,60 50,60 100,40 150,60 200,60" fill="none" stroke="#e91e63" strokeWidth="3" />
            </svg>
          )}
          {card.chartType === "doc" && !card.docList && (
            <svg width="60" height="60" viewBox="0 0 60 60">
              <rect x="10" y="10" width="40" height="50" rx="4" fill="#f3f6fa" />
              <rect x="18" y="20" width="24" height="4" fill="#cbd5e1" />
              <rect x="18" y="28" width="16" height="4" fill="#cbd5e1" />
            </svg>
          )}
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
            <div className="flex justify-between text-xs text-gray-500 border-b pb-1 mb-1">
              <span>เอกสาร</span>
              <span>สถานะ</span>
            </div>
            {card.docList.map((doc: any) => (
              <div key={doc.code} className="flex justify-between items-center py-1 text-sm">
                <div>
                  <div>{doc.name}</div>
                  <div className="text-xs text-gray-400">{doc.code} ครบกำหนด {doc.due}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span>{doc.amount}</span>
                  <span className="text-xs bg-pink-100 text-pink-600 rounded px-2 py-0.5 mt-1">{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Empty state */}
        {card.emptyText && !card.docList && (
          <div className="text-center text-gray-500 text-sm mt-2">
            {card.emptyText}
          </div>
        )}
        {/* Button */}
        {card.button && !card.docList && (
          <button className="mt-2 px-4 py-1 border border-sky-400 text-sky-600 rounded hover:bg-sky-50 text-sm">
            {card.button}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f6fa] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 4 cards */}
        {cards.slice(0, 4).map((card, i) => (
          <DashboardCard card={card} key={card.title} />
        ))}
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 mt-6">
        {/* Line chart card */}
        <DashboardCard card={cards[4]} />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Last 2 cards */}
        {cards.slice(5).map((card, i) => (
          <DashboardCard card={card} key={card.title} />
        ))}
      </div>
    </div>
  );
}
