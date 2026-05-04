import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const STATUS_BADGE: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700 border-green-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  FAILED: 'bg-red-100 text-red-600 border-red-200',
  CANCELLED: 'bg-red-100 text-red-600 border-red-200',
  EXPIRED: 'bg-gray-100 text-gray-600 border-gray-200',
  REFUNDED: 'bg-purple-100 text-purple-700 border-purple-200',
};

const fmt = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(v);

const fmtMethod = (m: string) =>
  m
    .split('_')
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(' ');

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminDonationsPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const perPage = 15;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    todayPaid,
    monthPaid,
    allTimePaid,
    allTimePaidCount,
    donations,
    totalCount,
    byStatus,
  ] = await Promise.all([
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: 'PAID', timestamp: { gte: startOfToday } },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: 'PAID', timestamp: { gte: startOfMonth } },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: 'PAID' },
    }),
    prisma.donation.count({ where: { paymentStatus: 'PAID' } }),
    prisma.donation.findMany({
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        amount: true,
        paymentMethod: true,
        paymentStatus: true,
        donationType: true,
        timestamp: true,
        user: { select: { name: true, email: true } },
        report: { select: { id: true, title: true } },
      },
    }),
    prisma.donation.count(),
    prisma.donation.groupBy({ by: ['paymentStatus'], _count: { id: true } }),
  ]);

  const statusMap = Object.fromEntries(
    byStatus.map((s) => [s.paymentStatus, s._count.id]),
  );
  const totalPages = Math.ceil(totalCount / perPage);
  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-black text-[#193C1F]">All Donations</h1>
        <p className="text-[#8EA087] font-medium">
          Monitor all donation transactions on the platform.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#193C1F] text-white rounded-2xl p-6">
          <p className="text-[#8EA087] text-sm font-medium mb-1">
            Today&apos;s Total
          </p>
          <p className="text-2xl font-black">
            {fmt(Number(todayPaid._sum.amount || 0))}
          </p>
        </div>
        <div className="bg-[#193C1F] text-white rounded-2xl p-6">
          <p className="text-[#8EA087] text-sm font-medium mb-1">This Month</p>
          <p className="text-2xl font-black">
            {fmt(Number(monthPaid._sum.amount || 0))}
          </p>
        </div>
        <div className="bg-[#193C1F] text-white rounded-2xl p-6">
          <p className="text-[#8EA087] text-sm font-medium mb-1">
            All-time Total
          </p>
          <p className="text-2xl font-black">
            {fmt(Number(allTimePaid._sum.amount || 0))}
          </p>
          <p className="text-xs text-[#8EA087] mt-1">
            {allTimePaidCount} successful transactions
          </p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {['PAID', 'PENDING', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED'].map(
          (s) => (
            <div
              key={s}
              className={`p-3 rounded-xl border text-center ${STATUS_BADGE[s]}`}
            >
              <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                {s}
              </p>
              <p className="text-2xl font-black mt-0.5">{statusMap[s] || 0}</p>
            </div>
          ),
        )}
      </div>

      {/* Donations Table */}
      <div className="bg-white border border-[#D0D5CB] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#D0D5CB] flex items-center justify-between">
          <h4 className="font-black text-[#193C1F]">All Transactions</h4>
          <span className="text-[#8EA087] text-xs">{totalCount} total</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#F7F3ED] text-[11px] text-[#8EA087] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Donor</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F3ED] text-sm">
            {donations.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-[#8EA087] font-medium"
                >
                  No donations yet.
                </td>
              </tr>
            ) : (
              donations.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-[#F7F3ED]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#193C1F]">{d.user.name}</p>
                    <p className="text-[11px] text-[#8EA087]">{d.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    {d.donationType === 'PLATFORM' ? (
                      <span className="text-xs font-bold text-[#8EA087] bg-[#F7F3ED] border border-[#D0D5CB] px-2 py-1 rounded-full">
                        Platform
                      </span>
                    ) : d.report ? (
                      <Link
                        href={`/publicreports/${d.report.id}`}
                        className="text-xs font-medium text-[#193C1F] hover:underline line-clamp-1"
                      >
                        {d.report.title}
                      </Link>
                    ) : (
                      <span className="text-[#8EA087] text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#8EA087] italic text-xs">
                    {fmtMethod(d.paymentMethod)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${STATUS_BADGE[d.paymentStatus] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {d.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#8EA087] text-xs">
                    {fmtDate(d.timestamp)}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-[#193C1F]">
                    {fmt(Number(d.amount))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#F7F3ED]/50 border-t border-[#D0D5CB] flex justify-between items-center">
            <span className="text-[#8EA087] text-xs font-semibold">
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalCount)}{' '}
              of {totalCount}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/admin/donations?page=${page - 1}`}
                  className="px-3 py-1.5 text-xs font-bold text-[#193C1F] bg-white border border-[#D0D5CB] rounded-lg hover:border-[#193C1F]"
                >
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/dashboard/admin/donations?page=${page + 1}`}
                  className="px-3 py-1.5 text-xs font-bold text-[#193C1F] bg-white border border-[#D0D5CB] rounded-lg hover:border-[#193C1F]"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
