'use client';

import { useEffect, useState } from 'react';

type ReportOption = {
  id: number;
  title: string;
  category: string;
  city: string;
  province: string;
  description: string;
};

type Props = {
  onSelect: (report: ReportOption) => void;
  onBack: () => void;
};

export function ReportPicker({ onSelect, onBack }: Props) {
  const [reports, setReports] = useState<ReportOption[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/publicreports')
      .then((r) => r.json())
      .then((d) => setReports(d.data || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#8EA087] hover:text-[#193C1F] font-bold text-sm transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#193C1F]">
            Choose a Report to Support
          </h2>
          <p className="text-[#8EA087] text-sm">
            Select the case you want to donate to
          </p>
        </div>
      </div>

      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8EA087]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, category, or city..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#D0D5CB] bg-white focus:ring-[#8EA087] focus:border-[#8EA087] outline-none text-sm"
        />
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#193C1F]" />
          <p className="text-[#8EA087] mt-3 font-medium text-sm">
            Loading reports...
          </p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-[#8EA087] font-medium">
          No reports found.
        </div>
      )}

      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
        {filtered.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-[#D0D5CB] rounded-2xl p-5 hover:border-[#193C1F] hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onSelect(report)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8EA087] bg-[#F7F3ED] px-2 py-0.5 rounded-full">
                    {report.category}
                  </span>
                  <span className="text-[10px] text-[#8EA087]">
                    #{String(report.id).padStart(4, '0')}
                  </span>
                </div>
                <h3 className="font-bold text-[#193C1F] mb-1 line-clamp-1 group-hover:text-[#8EA087] transition-colors">
                  {report.title}
                </h3>
                <p className="text-xs text-[#193C1F]/60 line-clamp-2">
                  {report.description}
                </p>
                <p className="text-xs text-[#8EA087] mt-2 font-medium">
                  {report.city}, {report.province}
                </p>
              </div>
              <button className="shrink-0 px-4 py-2 bg-[#193C1F] text-white text-xs font-bold rounded-xl group-hover:bg-[#8EA087] transition-colors whitespace-nowrap">
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
