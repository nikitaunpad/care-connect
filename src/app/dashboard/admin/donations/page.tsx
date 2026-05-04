import { prisma } from '@/lib/prisma';

import { DonationClient } from './DonationClient';

export default async function AdminDonationsPage() {
  const donations = await prisma.donation.findMany({
    orderBy: { timestamp: 'desc' },
    select: {
      id: true,
      reportId: true,
      userId: true,
      amount: true,
      paymentStatus: true,
      timestamp: true,
      report: {
        select: { title: true, description: true },
      },
      user: {
        select: { name: true },
      },
    },
  });

  const formattedDonations = donations.map((d) => ({
    id: d.id,
    reportId: d.reportId || 0,
    amount: Number(d.amount),
    userName: d.user?.name || 'Anonymous',
    message: '',
    paymentStatus: d.paymentStatus,
    createdAt: d.timestamp.toISOString(),
    report: {
      title: d.report?.title || 'Unknown Report',
      description: d.report?.description || '',
    },
  }));

  return (
    <div className="space-y-6 max-w-[1400px] w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Donations</h1>
        <p className="mt-2 text-sm text-gray-600">
          Review and update the status of incoming donations.
        </p>
      </div>

      <DonationClient donations={formattedDonations} />
    </div>
  );
}
