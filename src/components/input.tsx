import React from 'react';

// Kita buat interface yang mendukung ketiga elemen (input, textarea, select)
interface InputProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> {
  label?: string;
  type?: string;
  children?: React.ReactNode;
}

export const Input = ({
  label,
  type = 'text',
  className = '',
  children,
  ...props
}: InputProps) => {
  const baseStyles =
    'w-full bg-[#EBE6DE]/30 border border-transparent focus:border-[#8EA087] focus:bg-white p-4 rounded-2xl text-sm font-medium outline-none transition-all';

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label className="text-[11px] font-black uppercase tracking-widest text-[#8EA087]">
          {label}
        </label>
      )}

      {/* Logika Kondisional berdasarkan tipe */}
      {type === 'textarea' ? (
        <textarea
          className={`${baseStyles} resize-none ${className}`}
          rows={3}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : type === 'select' ? (
        <div className="relative">
          <select
            className={`${baseStyles} appearance-none cursor-pointer ${className}`}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
          {/* Ikon panah bawah kustom untuk select */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      ) : (
        <input
          type={type}
          className={`${baseStyles} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};
