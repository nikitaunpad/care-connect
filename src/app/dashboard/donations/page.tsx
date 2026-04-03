"use client";

import React from "react";

export default function DonationsPage() {
  const donators = [
    { name: "Anonymous Donor", date: "Oct 12, 2023", amount: "+$500.00", via: "Community Pool" },
    { name: "NGO Support Fund", date: "Oct 01, 2023", amount: "+$1,200.00", via: "Medical Aid Grant" },
    { name: "CareConnect Grant", date: "Sep 15, 2023", amount: "+$750.00", via: "Monthly Support" },
    { name: "HealthCare Foundation", date: "Aug 22, 2023", amount: "+$1,000.00", via: "Recovery Fund" },
  ];

  return (
    <div className="p-12 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-black text-[#193C1F] tracking-tight">Donation History</h2>
          <p className="text-[#8EA087] font-medium">Tracking all financial support contributed to your recovery.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-[#8EA087] uppercase tracking-[0.2em]">Total Balance Received</p>
          <p className="text-[42px] font-black text-[#193C1F]">$3,450.00</p>
        </div>
      </div>

      <div className="bg-white border border-[#D0D5CB] rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[#F7F3ED] bg-[#FDFCFB]">
          <h3 className="font-bold text-[18px] text-[#193C1F]">List of Contributions</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#F7F3ED] text-[11px] text-[#8EA087] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Donator Name</th>
              <th className="px-8 py-5">Date Received</th>
              <th className="px-8 py-5">Source / Via</th>
              <th className="px-8 py-5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#193C1F]">
            {donators.map((d, i) => (
              <tr key={i} className="border-b border-[#F7F3ED] hover:bg-[#FDFCFB] transition-colors group cursor-default">
                <td className="px-8 py-6 font-bold group-hover:text-[#8EA087] transition-colors">{d.name}</td>
                <td className="px-8 py-6 opacity-70 font-medium">{d.date}</td>
                <td className="px-8 py-6 italic text-[#8EA087]">{d.via}</td>
                <td className="px-8 py-6 text-right font-black text-[#193C1F] text-[16px]">{d.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}