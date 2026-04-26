'use client';

import { Pagination } from '@/components/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type DonationItem = {
  id: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  timestamp: string;
  report: {
    title: string;
    description: string;
  };
};

type DonationsContentProps = {
  donations: DonationItem[];
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

const formatDateLabel = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const formatPaymentMethod = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatPaymentStatus = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

type PaymentNoticeState =
  | 'success'
  | 'pending'
  | 'failed'
  | 'expired'
  | 'cancelled'
  | 'error';

const getPaymentStatusClass = (status: string) => {
  const normalized = status.toUpperCase();

  if (normalized === 'PAID') {
    return 'bg-green-100 text-green-700';
  }

  if (normalized === 'PENDING') {
    return 'bg-[#D1B698]/30 text-[#D1B698]';
  }

  if (normalized === 'FAILED' || normalized === 'CANCELLED') {
    return 'bg-red-100 text-red-600';
  }

  if (normalized === 'EXPIRED') {
    return 'bg-red-100 text-red-600';
  }

  if (normalized === 'REFUNDED') {
    return 'bg-blue-100 text-blue-700';
  }

  return 'bg-[#EBE6DE] text-[#193C1F]';
};

const getPaymentNotice = (
  payment: PaymentNoticeState | null,
  orderId: string | null,
) => {
  if (!payment) {
    return null;
  }

  const orderLabel = orderId ? ` (Order: ${orderId})` : '';

  if (payment === 'success') {
    return {
      containerClass: 'border border-green-200 bg-green-50 text-green-800',
      title: 'Payment Success',
      description: `Your donation payment was completed successfully${orderLabel}.`,
    };
  }

  if (payment === 'pending') {
    return {
      containerClass: 'border border-amber-200 bg-amber-50 text-amber-800',
      title: 'Payment Pending',
      description: `Your payment is still pending confirmation${orderLabel}. Please complete the payment if needed.`,
    };
  }

  if (payment === 'failed') {
    return {
      containerClass: 'border border-red-200 bg-red-50 text-red-700',
      title: 'Payment Failed',
      description: `We could not complete your payment${orderLabel}. Please try again.`,
    };
  }

  if (payment === 'expired') {
    return {
      containerClass: 'border border-red-200 bg-red-50 text-red-700',
      title: 'Payment Expired',
      description: `Your payment time has expired${orderLabel}. Please create a new donation payment.`,
    };
  }

  if (payment === 'cancelled') {
    return {
      containerClass: 'border border-red-200 bg-red-50 text-red-700',
      title: 'Payment Cancelled',
      description: `Your payment was cancelled${orderLabel}. You can try donating again anytime.`,
    };
  }

  if (payment === 'error') {
    return {
      containerClass: 'border border-red-200 bg-red-50 text-red-700',
      title: 'Payment Error',
      description: `An unexpected payment error occurred${orderLabel}. Please try again.`,
    };
  }

  return null;
};

const mapTransactionStatusToNotice = (
  transactionStatus: string | null,
): PaymentNoticeState | null => {
  if (!transactionStatus) {
    return null;
  }

  const normalized = transactionStatus.toLowerCase();

  if (normalized === 'pending') {
    return 'pending';
  }

  if (normalized === 'settlement' || normalized === 'capture') {
    return 'success';
  }

  if (
    normalized === 'deny' ||
    normalized === 'cancel' ||
    normalized === 'expire' ||
    normalized === 'failure'
  ) {
    return 'failed';
  }

  if (normalized === 'cancel') {
    return 'cancelled';
  }

  if (normalized === 'expire') {
    return 'expired';
  }

  if (normalized === 'failure') {
    return 'failed';
  }

  return null;
};

const mapDonationStatusToNotice = (
  status: string | undefined,
): PaymentNoticeState | null => {
  if (!status) {
    return null;
  }

  const normalized = status.toUpperCase();

  if (normalized === 'PAID') {
    return 'success';
  }

  if (normalized === 'PENDING') {
    return 'pending';
  }

  if (normalized === 'FAILED') {
    return 'failed';
  }

  if (normalized === 'EXPIRED') {
    return 'expired';
  }

  if (normalized === 'CANCELLED') {
    return 'cancelled';
  }

  return null;
};

export default function DonationsContent({ donations }: DonationsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('search')?.toLowerCase() || '';
  const payment = searchParams.get('payment');
  const orderId = searchParams.get('orderId') || searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

  // --- PAGINATION LOGIC START ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);
  // --- PAGINATION LOGIC END ---

  const initialNotice = useMemo<PaymentNoticeState | null>(
    () =>
      mapTransactionStatusToNotice(transactionStatus) ||
      (payment === 'success' || payment === 'pending' || payment === 'error'
        ? (payment as PaymentNoticeState)
        : null),
    [payment, transactionStatus],
  );
  const [resolvedPayment, setResolvedPayment] =
    useState<PaymentNoticeState | null>(initialNotice);
  const paymentNotice = getPaymentNotice(resolvedPayment, orderId);

  useEffect(() => {
    setResolvedPayment(initialNotice);
  }, [initialNotice]);

  useEffect(() => {
    if (!payment && !orderId && !transactionStatus) {
      return;
    }

    const shouldSyncStatus = !!orderId;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('payment');
    nextParams.delete('orderId');
    nextParams.delete('order_id');
    nextParams.delete('transaction_status');
    nextParams.delete('status_code');

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const wait = (ms: number) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      });

    const runSync = async () => {
      if (shouldSyncStatus) {
        const maxAttempts = payment === 'success' ? 6 : 3;

        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          if (cancelled) {
            return;
          }

          try {
            const res = await fetch('/api/donation/sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ orderId }),
            });

            if (res.ok) {
              const payload = await res.json().catch(() => ({}));
              const currentStatus = payload?.data?.paymentStatus as
                | string
                | undefined;

              const syncedNotice = mapDonationStatusToNotice(currentStatus);
              if (syncedNotice) {
                setResolvedPayment(syncedNotice);
              }

              router.refresh();

              if (currentStatus && currentStatus !== 'PENDING') {
                break;
              }
            }
          } catch (error) {
            console.error('Failed to sync donation status:', error);
          }

          if (attempt < maxAttempts - 1) {
            await wait(1500);
          }
        }
      }

      if (cancelled) {
        return;
      }

      timeout = setTimeout(() => {
        router.replace(nextUrl);
      }, 2500);
    };

    void runSync();

    return () => {
      cancelled = true;
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [orderId, pathname, payment, router, searchParams, transactionStatus]);

  const filteredData = donations.filter(
    (item) =>
      item.report.title.toLowerCase().includes(query) ||
      item.paymentMethod.toLowerCase().includes(query) ||
      item.paymentStatus.toLowerCase().includes(query),
  );

  // --- SLICE DATA FOR PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {paymentNotice && (
        <div
          className={`rounded-2xl px-5 py-4 ${paymentNotice.containerClass}`}
        >
          <p className="text-sm font-black uppercase tracking-wide">
            {paymentNotice.title}
          </p>
          <p className="text-sm mt-1">{paymentNotice.description}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-black text-[#193C1F]">
            Donation History
          </h2>
          <p className="text-[#8EA087] font-medium">
            {query
              ? `Showing results for "${query}"`
              : 'Your contributions to the community.'}
          </p>
        </div>
        <button
          onClick={() => router.push('/donation?from=dashboard')}
          className="px-7 py-3.5 bg-[#8EA087] hover:bg-[#193C1F] text-white rounded-2xl font-bold text-[14px] transition-all shadow-lg whitespace-nowrap"
        >
          + New Donation
        </button>
      </div>

      <div className="bg-white border border-[#D0D5CB] rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F7F3ED] text-[11px] text-[#8EA087] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Source / Donor</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Via</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Amount</th>
            </tr>
          </thead>
          {currentItems.length > 0 ? (
            currentItems.map((row) => (
              <tbody
                key={row.id}
                onMouseEnter={() => setHoveredRowId(row.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                className="group border-b border-[#F7F3ED] last:border-0"
              >
                <tr
                  className={`transition-colors cursor-default ${
                    hoveredRowId === row.id ? 'bg-[#FDFCFB]' : ''
                  }`}
                >
                  <td className="px-8 py-6">
                    <p className="font-bold text-[#193C1F]">
                      {row.report.title}
                    </p>
                    <p className="text-[12px] text-[#8EA087] font-medium opacity-60">
                      Donation #{row.id}
                    </p>
                  </td>
                  <td className="px-8 py-6 font-medium">
                    {formatDateLabel(row.timestamp)}
                  </td>
                  <td className="px-8 py-6 font-medium italic text-[#8EA087]">
                    {formatPaymentMethod(row.paymentMethod)}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black ${getPaymentStatusClass(
                        row.paymentStatus,
                      )}`}
                    >
                      {formatPaymentStatus(row.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-[16px]">
                    {formatRupiah(row.amount)}
                  </td>
                </tr>
                {/* Detail Dropdown Row */}
                <tr>
                  <td colSpan={5} className="p-0">
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out bg-[#FDFCFB] ${
                        hoveredRowId === row.id ? 'max-h-[800px]' : 'max-h-0'
                      }`}
                    >
                      <div className="px-8 pb-8 pt-2">
                        <div className="p-7 bg-white border border-[#D0D5CB]/40 rounded-[24px] shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Left Side: Donation Summary */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-[11px] font-black uppercase tracking-wider text-[#8EA087] mb-4">
                                  Donation Summary
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-[#8EA087] font-bold uppercase tracking-tight">
                                      Amount Contributed
                                    </p>
                                    <p className="text-[20px] font-black text-[#D1B698]">
                                      {formatRupiah(row.amount)}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-[#8EA087] font-bold uppercase tracking-tight">
                                      Payment Method
                                    </p>
                                    <p className="text-[14px] font-bold text-[#193C1F]">
                                      {formatPaymentMethod(row.paymentMethod)}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-[#8EA087] font-bold uppercase tracking-tight">
                                      Payment Status
                                    </p>
                                    <span
                                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${getPaymentStatusClass(
                                        row.paymentStatus,
                                      )}`}
                                    >
                                      {formatPaymentStatus(row.paymentStatus)}
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-[#8EA087] font-bold uppercase tracking-tight">
                                      Transaction Date
                                    </p>
                                    <p className="text-[14px] font-bold text-[#193C1F]">
                                      {formatDateLabel(row.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side: Target Report */}
                            <div className="border-l border-[#F7F3ED] pl-10 space-y-6">
                              <div>
                                <h4 className="text-[11px] font-black uppercase tracking-wider text-[#8EA087] mb-4">
                                  Target Report
                                </h4>
                                <div className="space-y-4">
                                  <div className="space-y-1">
                                    <p className="text-[10px] text-[#8EA087] font-bold uppercase tracking-tight">
                                      Case Title
                                    </p>
                                    <p className="text-[16px] font-bold text-[#193C1F]">
                                      {row.report.title}
                                    </p>
                                  </div>
                                  {row.report.description && (
                                    <div className="pt-2">
                                      <p className="text-[10px] text-[#8EA087] font-bold uppercase tracking-tight mb-1">
                                        Report Description
                                      </p>
                                      <div className="bg-[#F7F3ED]/30 p-4 rounded-xl border border-[#F7F3ED] max-h-[150px] overflow-y-auto custom-scrollbar">
                                        <p className="text-[13px] leading-relaxed text-[#193C1F]/80 whitespace-pre-wrap font-medium italic">
                                          &quot;{row.report.description}&quot;
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody className="text-[14px] text-[#193C1F]">
              <tr>
                <td
                  colSpan={5}
                  className="p-20 text-center text-[#8EA087] font-bold"
                >
                  No donations found.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
