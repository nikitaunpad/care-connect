'use client';

import { authClient } from '@/lib/auth/auth-client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

function PublicHeaderContent() {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const fromDashboard = searchParams.get('from') === 'dashboard';

  // Helper function to check if the path is active
  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#F7F3ED]/90 backdrop-blur-md py-6 px-12 flex justify-between items-center border-b border-[#D0D5CB]">
      <Link
        href="/"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <div className="w-10 h-10 bg-[#193C1F] rounded-lg flex items-center justify-center text-[#F7F3ED]">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.744c0 5.578 4.5 10.13 10.125 10.13 5.625 0 10.125-4.552 10.125-10.13 0-1.494-.273-2.925-.77-4.244a11.959 11.959 0 0 1-8.355-3.212Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        <span className="text-2xl font-bold text-[#193C1F]">CareConnect</span>
      </Link>

      {fromDashboard ? (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#193C1F] font-bold hover:text-[#8EA087] transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Dashboard
        </button>
      ) : (
        <>
          <nav className="flex items-center gap-12 text-[#193C1F] font-medium hidden md:flex">
            <Link
              href="/"
              className={`transition-colors ${isActive('/') ? 'text-[#8EA087] font-bold border-b-2 border-[#8EA087] pb-1' : 'hover:text-[#8EA087]'}`}
            >
              Home
            </Link>
            <Link
              href={isLoggedIn ? '/consultation' : '/login'}
              className={`transition-colors ${isActive('/consultation') ? 'text-[#8EA087] font-bold border-b-2 border-[#8EA087] pb-1' : 'hover:text-[#8EA087]'}`}
            >
              Consultation
            </Link>
            <Link
              href={isLoggedIn ? '/publicreports' : '/login'}
              className={`transition-colors ${isActive('/publicreports') ? 'text-[#8EA087] font-bold border-b-2 border-[#8EA087] pb-1' : 'hover:text-[#8EA087]'}`}
            >
              Reports
            </Link>
            <Link
              href={isLoggedIn ? '/forums' : '/login'}
              className={`transition-colors ${
                isActive('/forums')
                  ? 'text-[#8EA087] font-bold border-b-2 border-[#8EA087] pb-1'
                  : 'hover:text-[#8EA087]'
              }`}
            >
              Forum
            </Link>

            <Link
              href={isLoggedIn ? '/donation' : '/login'}
              className={`transition-colors ${
                isActive('/donation')
                  ? 'text-[#8EA087] font-bold border-b-2 border-[#8EA087] pb-1'
                  : 'hover:text-[#8EA087]'
              }`}
            >
              Donation
            </Link>
          </nav>
          <Link href={isLoggedIn ? '/dashboard' : '/login'}>
            <button className="bg-[#8EA087] text-[#F7F3ED] px-8 py-2.5 rounded-lg font-bold hover:bg-[#193C1F] transition-colors">
              {isLoggedIn ? 'Dashboard' : 'Login/Register'}
            </button>
          </Link>
        </>
      )}
    </header>
  );
}

export function PublicHeader() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-[100] h-[92px] w-full bg-[#F7F3ED]/90 border-b border-[#D0D5CB]" />
      }
    >
      <PublicHeaderContent />
    </Suspense>
  );
}
