'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // Jika hanya ada 1 halaman, tidak perlu menampilkan pagination
  if (totalPages <= 1) return null;

  // Fungsi helper untuk menentukan angka halaman mana saja yang muncul (opsional jika data sangat banyak)
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-xl text-[13px] font-black transition-all duration-200 ${
            currentPage === i
              ? 'bg-[#193C1F] text-white shadow-md scale-105'
              : 'bg-white text-[#8EA087] border border-[#D0D5CB] hover:border-[#193C1F] hover:text-[#193C1F]'
          }`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-10 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#D0D5CB] bg-white text-[#193C1F] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#F7F3ED] transition-all group"
        title="Previous Page"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
      </button>

      {/* Angka Halaman */}
      <div className="flex items-center gap-2">{renderPageNumbers()}</div>

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#D0D5CB] bg-white text-[#193C1F] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#F7F3ED] transition-all group"
        title="Next Page"
      >
        <ChevronRight
          size={20}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </button>
    </div>
  );
};
