"use client";

import React from "react";

export default function ConsultationsPage() {
  // Simulasi 10 data konsultasi untuk menunjukkan fitur "View All"
  const allSessions = [
    { name: "Dr. Robert Chen", spec: "General Practitioner", date: "Oct 12, 2023", time: "02:00 PM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
    { name: "Dr. Sarah Meyer", spec: "Psychologist", date: "Oct 15, 2023", time: "10:00 AM", status: "UPCOMING", color: "bg-[#D1B698]/20 text-[#D1B698]" },
    { name: "Dr. Linda James", spec: "Therapist", date: "Sep 28, 2023", time: "09:00 AM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
    { name: "Dr. Michael Vogt", spec: "Psychiatrist", date: "Sep 20, 2023", time: "11:30 AM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
    { name: "Dr. Emily Watson", spec: "Counselor", date: "Sep 15, 2023", time: "01:00 PM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
    { name: "Dr. Robert Chen", spec: "General Practitioner", date: "Sep 05, 2023", time: "03:00 PM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
    { name: "Dr. Sarah Meyer", spec: "Psychologist", date: "Aug 28, 2023", time: "10:00 AM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
    { name: "Dr. Linda James", spec: "Therapist", date: "Aug 20, 2023", time: "09:00 AM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
    { name: "Dr. Alan Smith", spec: "Neurologist", date: "Aug 12, 2023", time: "04:00 PM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
    { name: "Dr. Sarah Meyer", spec: "Psychologist", date: "Aug 05, 2023", time: "10:00 AM", status: "COMPLETED", color: "bg-[#EBE6DE] text-[#193C1F]" },
  ];

  return (
    <div className="p-12 space-y-8 animate-fade-in">
      {/* HEADER HALALMAN */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-black text-[#193C1F] tracking-tight">Consultation History</h2>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-[#D0D5CB] rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[#F7F3ED] bg-[#FDFCFB]">
          <h3 className="font-bold text-[18px] text-[#193C1F]">All Medical Records</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#F7F3ED] text-[11px] text-[#8EA087] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Doctor Name</th>
              <th className="px-8 py-5">Specialty</th>
              <th className="px-8 py-5">Date & Time</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#193C1F]">
            {allSessions.map((s, i) => (
              <tr key={i} className="border-b border-[#F7F3ED] hover:bg-[#FDFCFB] transition-colors group">
                <td className="px-8 py-6 font-bold flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F2EDE4] flex items-center justify-center text-[10px] font-black">DR</div>
                  {s.name}
                </td>
                <td className="px-8 py-6 text-[#8EA087] font-medium">{s.spec}</td>
                <td className="px-8 py-6">
                  <p className="font-bold">{s.date}</p>
                  <p className="text-[12px] opacity-60">{s.time}</p>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase ${s.color}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-[12px] font-black text-[#8EA087] hover:text-[#193C1F] transition-colors underline underline-offset-4 uppercase">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}