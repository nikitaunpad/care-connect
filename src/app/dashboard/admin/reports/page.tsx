import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  REVIEWED: 'bg-blue-100 text-blue-700 border-blue-200',
  RESOLVED: 'bg-green-100 text-green-700 border-green-200',
  REJECTED: 'bg-red-100 text-red-600 border-red-200',
};

const CATEGORY_LABEL: Record<string, string> = {
  PHYSICAL: 'Physical',
  SEXUAL: 'Sexual',
  PSYCHOLOGICAL: 'Psychological',
  OTHER: 'Other',
};

type PageProps = {
  searchParams: Promise<{ status?: string; page?: string }>;
};

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const { status: filterStatus, page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const perPage = 10;

  const where =
    filterStatus && filterStatus !== 'ALL'
      ? { status: filterStatus as never }
      : {};

  const [reports, totalCount] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        isAnonymous: true,
        province: true,
        city: true,
        incidentDate: true,
        createdAt: true,
        description: true,
        user: { select: { name: true, email: true } },
        evidences: { select: { id: true }, take: 1 },
        donations: {
          where: { paymentStatus: 'PAID' },
          select: { amount: true },
        },
      },
    }),
    prisma.report.count({ where }),
  ]);

  const statusCounts = await prisma.report.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  const countMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.id]),
  );
  const totalAll = Object.values(countMap).reduce((a, b) => a + b, 0);

  const totalPages = Math.ceil(totalCount / perPage);
  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  const fmt = (v: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(v);

  const tabs = [
    { label: 'All', value: 'ALL', count: totalAll },
    { label: 'Pending', value: 'PENDING', count: countMap['PENDING'] || 0 },
    { label: 'Reviewed', value: 'REVIEWED', count: countMap['REVIEWED'] || 0 },
    { label: 'Resolved', value: 'RESOLVED', count: countMap['RESOLVED'] || 0 },
    { label: 'Rejected', value: 'REJECTED', count: countMap['REJECTED'] || 0 },
  ];

  const activeTab = filterStatus || 'ALL';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-black text-[#193C1F]">
          Reports Moderation
        </h1>
        <p className="text-[#8EA087] font-medium">
          Review and manage all incident reports.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/dashboard/admin/reports?status=${tab.value}`}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              activeTab === tab.value
                ? 'bg-[#193C1F] text-white border-[#193C1F]'
                : 'bg-white text-[#193C1F] border-[#D0D5CB] hover:border-[#193C1F]'
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.value ? 'bg-white/20' : 'bg-[#F7F3ED]'}`}
            >
              {tab.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#D0D5CB] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F7F3ED] text-[11px] text-[#8EA087] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Report</th>
              <th className="px-6 py-4">Reporter</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Donations</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F3ED] text-sm">
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-[#8EA087] font-medium"
                >
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((r) => {
                const totalDonated = r.donations.reduce(
                  (sum, d) => sum + Number(d.amount),
                  0,
                );
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-[#F7F3ED]/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/publicreports/${r.id}`}
                        className="hover:underline"
                      >
                        <p className="font-bold text-[#193C1F] line-clamp-1">
                          {r.title}
                        </p>
                      </Link>
                      <p className="text-[11px] text-[#8EA087] mt-0.5">
                        {r.city}, {r.province} ·{' '}
                        {r.evidences.length > 0
                          ? '📎 Has evidence'
                          : 'No evidence'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {r.isAnonymous ? (
                        <span className="text-[#8EA087] italic text-xs">
                          Anonymous
                        </span>
                      ) : (
                        <>
                          <p className="font-medium text-[#193C1F]">
                            {r.user.name}
                          </p>
                          <p className="text-[11px] text-[#8EA087]">
                            {r.user.email}
                          </p>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#193C1F] bg-[#F7F3ED] border border-[#D0D5CB] px-2 py-1 rounded-full">
                        {CATEGORY_LABEL[r.category] || r.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${STATUS_BADGE[r.status] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {totalDonated > 0 ? (
                        <span className="text-green-700 font-bold text-xs">
                          {fmt(totalDonated)}
                        </span>
                      ) : (
                        <span className="text-[#8EA087] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#8EA087] text-xs">
                      {fmtDate(r.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#F7F3ED]/50 border-t border-[#D0D5CB] flex justify-between items-center">
            <span className="text-[#8EA087] text-xs font-semibold">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, totalCount)} of {totalCount}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/dashboard/admin/reports?status=${activeTab}&page=${page - 1}`}
                  className="px-3 py-1.5 text-xs font-bold text-[#193C1F] bg-white border border-[#D0D5CB] rounded-lg hover:border-[#193C1F] transition-colors"
                >
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/dashboard/admin/reports?status=${activeTab}&page=${page + 1}`}
                  className="px-3 py-1.5 text-xs font-bold text-[#193C1F] bg-white border border-[#D0D5CB] rounded-lg hover:border-[#193C1F] transition-colors"
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
