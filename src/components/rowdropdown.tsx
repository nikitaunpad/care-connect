'use client';

import React from 'react';

interface RowDropdownProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const RowDropdown = ({ isVisible, children }: RowDropdownProps) => {
  return (
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isVisible
          ? 'grid-rows-[1fr] opacity-100 py-4'
          : 'grid-rows-[0fr] opacity-0 py-0'
      }`}
    >
      <div className="overflow-hidden">
        <div className="bg-[#F7F3ED]/50 rounded-[24px] border border-[#D0D5CB] p-6 grid grid-cols-2 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};
