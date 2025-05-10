import { DashboardCard } from '@/types/dashboard';

export const dashboardCards: DashboardCard[] = [
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