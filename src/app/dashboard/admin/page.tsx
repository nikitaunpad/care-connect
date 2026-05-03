import { prisma } from '@/lib/prisma';

import {
  ConsultationLineChart,
  DonationLineChart,
  ReportsBarChart,
} from './AdminCharts';

const fmt = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(v);

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalReports,
    pendingReports,
    reportsByStatus,
    totalConsultations,
    activeConsultations,
    consultationsByStatus,
    totalDonationsCount,
    allTimePaid,
    todayPaid,
    monthPaid,
    recentDonations,
    totalChats,
    donations7Days,
  ] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.report.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.consultation.count(),
    prisma.consultation.count({
      where: { status: { in: ['SCHEDULED', 'ONGOING'] } },
    }),
    prisma.consultation.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.donation.count({ where: { paymentStatus: 'PAID' } }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: 'PAID' },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: 'PAID', timestamp: { gte: startOfToday } },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: 'PAID', timestamp: { gte: startOfMonth } },
    }),
    prisma.donation.findMany({
      where: { paymentStatus: 'PAID' },
      take: 5,
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        amount: true,
        paymentMethod: true,
        timestamp: true,
        donationType: true,
        user: { select: { name: true, email: true } },
        report: { select: { title: true } },
      },
    }),
    prisma.chat.count(),
    prisma.donation.findMany({
      where: {
        paymentStatus: 'PAID',
        timestamp: { gte: getLast7Days()[0] },
      },
      select: { amount: true, timestamp: true },
    }),
  ]);

  // Group donations by day for line chart
  const days = getLast7Days();
  const donationChartData = days.map((day) => {
    const label = day.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
    });
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayDonations = donations7Days.filter(
      (d) => d.timestamp >= day && d.timestamp < nextDay,
    );
    return {
      date: label,
      total: dayDonations.reduce((sum, d) => sum + Number(d.amount), 0),
      count: dayDonations.length,
    };
  });

  const reportsChartData = reportsByStatus.map((r) => ({
    status: r.status.charAt(0) + r.status.slice(1).toLowerCase(),
    count: r._count.id,
  }));

  const consultChartData = consultationsByStatus.map((c) => ({
    status: c.status.charAt(0) + c.status.slice(1).toLowerCase(),
    count: c._count.id,
  }));

  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);

  const fmtMethod = (m: string) =>
    m
      .split('_')
      .map((w) => w[0] + w.slice(1).toLowerCase())
      .join(' ');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-black text-[#193C1F]">
          Admin Dashboard
        </h1>
        <p className="text-[#8EA087] font-medium">
          Platform overview & moderation center.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Reports */}
        <div className="bg-white border border-[#D0D5CB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#F7F3ED] rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#193C1F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
              {pendingReports} pending
            </span>
          </div>
          <p className="text-[#8EA087] text-sm font-medium">Total Reports</p>
          <h3 className="text-4xl font-black text-[#193C1F] mt-1">
            {totalReports}
          </h3>
        </div>

        {/* Consultations */}
        <div className="bg-white border border-[#D0D5CB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#F7F3ED] rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#193C1F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
              {activeConsultations} active
            </span>
          </div>
          <p className="text-[#8EA087] text-sm font-medium">
            Total Consultations
          </p>
          <h3 className="text-4xl font-black text-[#193C1F] mt-1">
            {totalConsultations}
          </h3>
        </div>

        {/* Donations */}
        <div className="bg-white border border-[#D0D5CB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#F7F3ED] rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#193C1F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8EA087] bg-[#F7F3ED] px-2 py-1 rounded-full border border-[#D0D5CB]">
              {totalDonationsCount} tx
            </span>
          </div>
          <p className="text-[#8EA087] text-sm font-medium">
            All-time Donations
          </p>
          <h3 className="text-2xl font-black text-[#193C1F] mt-1">
            {fmt(Number(allTimePaid._sum.amount || 0))}
          </h3>
        </div>

        {/* Forum */}
        <div className="bg-white border border-[#D0D5CB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[#F7F3ED] rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#193C1F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8EA087] bg-[#F7F3ED] px-2 py-1 rounded-full border border-[#D0D5CB]">
              Community
            </span>
          </div>
          <p className="text-[#8EA087] text-sm font-medium">Forum Messages</p>
          <h3 className="text-4xl font-black text-[#193C1F] mt-1">
            {totalChats}
          </h3>
        </div>
      </div>

      {/* Donation Summary Row */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            label: "Today's Donations",
            value: fmt(Number(todayPaid._sum.amount || 0)),
          },
          {
            label: "This Month's Donations",
            value: fmt(Number(monthPaid._sum.amount || 0)),
          },
          {
            label: 'All-time Collected',
            value: fmt(Number(allTimePaid._sum.amount || 0)),
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-[#193C1F] text-white rounded-2xl p-6"
          >
            <p className="text-[#8EA087] text-sm font-medium mb-2">
              {item.label}
            </p>
            <p className="text-2xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donations Line Chart */}
        <div className="lg:col-span-1 bg-white border border-[#D0D5CB] rounded-2xl p-6 shadow-sm">
          <h4 className="font-black text-[#193C1F] mb-1">Donations (7 Days)</h4>
          <p className="text-[#8EA087] text-xs mb-4">Total amount per day</p>
          <DonationLineChart data={donationChartData} />
        </div>

        {/* Reports Bar Chart */}
        <div className="bg-white border border-[#D0D5CB] rounded-2xl p-6 shadow-sm">
          <h4 className="font-black text-[#193C1F] mb-1">Reports by Status</h4>
          <p className="text-[#8EA087] text-xs mb-4">
            Distribution of all reports
          </p>
          <ReportsBarChart data={reportsChartData} />
        </div>

        {/* Consultations Bar Chart */}
        <div className="bg-white border border-[#D0D5CB] rounded-2xl p-6 shadow-sm">
          <h4 className="font-black text-[#193C1F] mb-1">
            Consultations by Status
          </h4>
          <p className="text-[#8EA087] text-xs mb-4">
            Distribution of all consultations
          </p>
          <ConsultationLineChart data={consultChartData} />
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white border border-[#D0D5CB] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#D0D5CB] flex justify-between items-center">
          <div>
            <h4 className="font-black text-[#193C1F]">Recent Donations</h4>
            <p className="text-[#8EA087] text-xs mt-0.5">
              Latest successful transactions
            </p>
          </div>
          <a
            href="/dashboard/admin/donations"
            className="text-sm font-bold text-[#8EA087] hover:text-[#193C1F] transition-colors"
          >
            View All →
          </a>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#F7F3ED] text-[11px] text-[#8EA087] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Donor</th>
              <th className="px-6 py-4">For</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F3ED] text-sm">
            {recentDonations.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-[#8EA087]"
                >
                  No donations yet.
                </td>
              </tr>
            ) : (
              recentDonations.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-[#F7F3ED]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#193C1F]">{d.user.name}</p>
                    <p className="text-[11px] text-[#8EA087]">{d.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-[#193C1F]">
                    {d.donationType === 'PLATFORM' ? (
                      <span className="text-xs font-bold text-[#8EA087] bg-[#F7F3ED] px-2 py-1 rounded-full">
                        Platform
                      </span>
                    ) : (
                      <span className="text-xs line-clamp-1">
                        {d.report?.title || '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#8EA087] italic">
                    {fmtMethod(d.paymentMethod)}
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
      </div>
    </div>
  );
}
