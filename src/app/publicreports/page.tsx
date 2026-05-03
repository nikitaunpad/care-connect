'use client';

import { Alert } from '@/components/alert';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { PublicHeader } from '@/components/public-header';
// Import komponen Alert kamu
import { ArrowRight, Filter, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Report {
  id: string;
  title: string;
  category: string;
  province: string;
  city: string;
  status: string;
  incidentDate: string;
  description: string;
  createdAt: string;
  coverImageUrl: string | null;
}

const PublicReportsPage = () => {
  const router = useRouter();
  // State untuk Alert Privacy
  const [isPrivacyAlertOpen, setIsPrivacyAlertOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/publicreports');

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        setReports(data.data || []);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      {/* 1. Header */}
      <PublicHeader />

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {/* Search Bar for Reports */}
        <div className="mb-6 relative w-full">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-70">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8EA087"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords in title, description, or category..."
            className="w-full h-[52px] bg-[#EBE6DE] border border-[#D0D5CB] focus:border-[#8EA087] focus:bg-white rounded-2xl pl-14 pr-6 outline-none text-[15px] text-[#193C1F] shadow-sm transition-all"
          />
        </div>

        {/* 2. Alert Privacy (Pakai komponen Alert kamu) */}
        <Alert
          isOpen={isPrivacyAlertOpen}
          onClose={() => setIsPrivacyAlertOpen(false)}
          onConfirm={() => setIsPrivacyAlertOpen(false)}
          type="primary"
          title="Privacy Information"
          description="All data is anonymized to protect reporter and care recipient privacy while ensuring public transparency."
          confirmText="I Understand"
        />

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-72 space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-[#D0D5CB] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-black uppercase text-sm tracking-widest flex items-center gap-2 text-[#193C1F]">
                  <Filter size={18} /> Filters
                </h2>
                <button className="text-[10px] text-[#8EA087] font-black uppercase hover:underline transition-all">
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-4 mb-10">
                <p className="text-[11px] font-black text-[#8EA087] uppercase tracking-widest">
                  Category
                </p>
                {[
                  'Elderly Care',
                  'Child Safety',
                  'Healthcare',
                  'Facility Quality',
                ].map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border-[#D0D5CB] accent-[#193C1F] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#193C1F] group-hover:text-[#8EA087] transition-colors">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>

              {/* Location & Date pakai Input Kamu */}
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-black text-[#8EA087] uppercase tracking-widest mb-3">
                    Location
                  </p>
                  <Input
                    placeholder="Search location..."
                    name="location"
                    className="bg-[#F7F3ED] border-transparent"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-black text-[#8EA087] uppercase tracking-widest mb-3">
                    Date Range
                  </p>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      name="start"
                      className="bg-[#F7F3ED] border-transparent"
                    />
                    <Input
                      type="date"
                      name="end"
                      className="bg-[#F7F3ED] border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Button dari Components Kamu */}
              <div className="mt-8">
                <Button className="w-full bg-[#8EA087] hover:bg-[#193C1F] text-white rounded-[18px] py-6 font-black uppercase tracking-widest transition-all">
                  Apply Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 text-left">
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase text-[#193C1F] leading-none mb-4 italic tracking-tight">
                  Public Reports
                </h1>
                <p className="text-[#8EA087] text-lg font-medium">
                  Community safety and care quality insights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-[#D0D5CB] shadow-sm">
                  <span className="text-[10px] font-black text-[#8EA087] uppercase tracking-widest">
                    Sort:
                  </span>
                  <select className="bg-transparent font-bold text-xs text-[#193C1F] outline-none cursor-pointer">
                    <option>Most Recent</option>
                    <option>Oldest</option>
                  </select>
                </div>
                <Link href="/report">
                  <Button className="bg-[#193C1F] hover:bg-[#8EA087] text-[#F7F3ED] rounded-2xl px-6 py-2.5 font-bold shadow-md transition-colors flex items-center gap-2">
                    Create Incident Report
                  </Button>
                </Link>
              </div>
            </div>

            {/* Grid Reports */}
            {isLoading && (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#193C1F] mb-4"></div>
                  <p className="text-[#8EA087] font-medium">
                    Loading reports...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="col-span-full bg-red-50 border border-red-200 rounded-2xl p-6">
                <p className="text-red-700 font-medium">
                  Failed to load reports: {error}
                </p>
              </div>
            )}

            {!isLoading && !error && reports.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-[#8EA087] font-medium">
                  No reports available
                </p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 col-span-full">
                {reports
                  .filter(
                    (report) =>
                      report.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      report.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      report.category
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )
                  .map((report) => (
                    <div
                      key={report.id}
                      className="group relative flex flex-col h-full"
                    >
                      <Link
                        href={`/publicreports/${report.id}`}
                        className="flex-1"
                      >
                        <div className="bg-white rounded-[40px] border border-[#D0D5CB] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                          {/* Thumbnail / ID Box */}
                          <div className="h-44 bg-[#F7F3ED] flex items-center justify-center relative overflow-hidden transition-colors group-hover:bg-[#EBE6DE]">
                            {report.coverImageUrl ? (
                              <Image
                                src={report.coverImageUrl}
                                alt={report.title}
                                className="absolute inset-0 h-full w-full object-cover"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-[#F7F3ED] via-[#E6DED3] to-[#D0D5CB]" />
                            )}
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-[#193C1F]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-10">
                              <span className="text-white font-black text-sm uppercase tracking-widest">
                                View Details
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  router.push(`/donation/report/${report.id}`);
                                }}
                                className="px-4 py-2 bg-[#8EA087] hover:bg-white hover:text-[#193C1F] text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-colors flex items-center gap-1.5"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                                Donate for This Case
                              </button>
                            </div>
                            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#8EA087] bg-white px-5 py-2.5 rounded-2xl border border-[#D0D5CB] shadow-sm">
                              ID: {report.id.toString().padStart(5, '0')}
                            </span>
                          </div>

                          <div className="p-8 text-left flex flex-col flex-1">
                            <span className="text-[9px] font-black text-[#8EA087] uppercase tracking-[0.2em] mb-4 inline-block">
                              {report.category}
                            </span>
                            <h3 className="font-black text-xl text-[#193C1F] mb-3 group-hover:text-[#8EA087] transition-colors italic tracking-tight line-clamp-2">
                              {report.title}
                            </h3>
                            <p className="text-sm text-[#193C1F]/60 font-medium leading-relaxed mb-8 flex-1 line-clamp-3">
                              {report.description}
                            </p>

                            <div className="flex justify-between items-center pt-6 border-t border-[#F7F3ED]">
                              <span className="text-[10px] font-black text-[#8EA087] uppercase flex items-center gap-2 tracking-widest">
                                <MapPin size={14} strokeWidth={3} />{' '}
                                {report.city}
                              </span>
                              <span className="text-[11px] font-black uppercase flex items-center gap-1 text-[#193C1F] group-hover:gap-3 transition-all tracking-[0.1em]">
                                Details <ArrowRight size={16} strokeWidth={3} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicReportsPage;
