"use client";

import React from "react";

export default function ReportsPage() {
  const allReports = Array(10).fill(null).map((_, i) => ({
    id: `#REP - ${8821 - i}`,
    type: i % 2 === 0 ? "Incident Recovery" : "Legal Aid Request",
    status: i < 3 ? "PENDING REVIEW" : "APPROVED",
    date: `Oct ${12 - i}, 2023`
  }));

  return (
    <div className="p-12 space-y-8 animate-fade-in">
      <h2 className="text-[32px] font-black text-[#193C1F] tracking-tight">Full Report History</h2>
      <div className="bg-white border border-[#D0D5CB] rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F7F3ED] text-[11px] text-[#8EA087] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Report ID</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#193C1F]">
            {allReports.map((r, i) => (
              <tr key={i} className="border-b border-[#F7F3ED] hover:bg-[#FDFCFB] transition-colors">
                <td className="px-8 py-5 font-bold">{r.id}</td>
                <td className="px-8 py-5 opacity-70">{r.date}</td>
                <td className="px-8 py-5 font-medium">{r.type}</td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${r.status === 'APPROVED' ? 'bg-[#EBE6DE]' : 'bg-[#D1B698]/30 text-[#D1B698]'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}