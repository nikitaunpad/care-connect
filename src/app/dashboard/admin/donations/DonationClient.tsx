'use client';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Toast } from '@/components/toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type DonationType = {
  id: number;
  reportId: number;
  userName: string;
  amount: number;
  message: string;
  paymentStatus: string;
  createdAt: string;
  report: {
    title: string;
    description: string;
  };
};

export function DonationClient({ donations }: { donations: DonationType[] }) {
  const router = useRouter();
  const [toastState, setToastState] = useState<{
    show: boolean;
    msg: string;
    type: 'success' | 'error';
  }>({ show: false, msg: '', type: 'success' });
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fmt = (v: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(v);

  const fmtDate = (d: string) =>
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      minute: '2-digit',
      hour: '2-digit',
    }).format(new Date(d));

  const handleStatusChange = async (id: number, status: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/donation?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setToastState({
        show: true,
        msg: `Donation status updated to ${status}`,
        type: 'success',
      });
      router.refresh();
    } catch (err) {
      console.error(err);
      setToastState({
        show: true,
        msg: 'Error updating donation',
        type: 'error',
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {toastState.show && (
        <Toast
          show={toastState.show}
          msg={toastState.msg}
          type={toastState.type}
          onClose={() => setToastState({ ...toastState, show: false })}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {donations.map((d) => (
          <Card key={d.id} className="overflow-hidden">
            <div className="bg-gray-50/50 p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {fmt(d.amount)}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    {d.userName}
                  </p>
                </div>
                <Badge
                  status={
                    d.paymentStatus === 'PAID'
                      ? 'SUCCESS'
                      : d.paymentStatus === 'PENDING'
                        ? 'PENDING'
                        : 'DEFAULT'
                  }
                >
                  {d.paymentStatus}
                </Badge>
              </div>
            </div>
            <div className="p-4 pt-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    For Report
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-1 font-medium">
                    {d.report.title}
                  </p>
                </div>
                {d.message && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                      Message
                    </p>
                    <p className="text-sm text-gray-600 italic line-clamp-2">
                      &quot;{d.message}&quot;
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                    Date
                  </p>
                  <p className="text-sm text-gray-700">
                    {fmtDate(d.createdAt)}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 border-t mt-4 border-gray-100">
                  <Button
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => handleStatusChange(d.id, 'PAID')}
                    disabled={loadingId === d.id || d.paymentStatus === 'PAID'}
                  >
                    {loadingId === d.id ? 'Updating...' : 'Mark as PAID'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-xs text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleStatusChange(d.id, 'FAILED')}
                    disabled={
                      loadingId === d.id || d.paymentStatus === 'FAILED'
                    }
                  >
                    {loadingId === d.id ? 'Updating...' : 'Mark as FAILED'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {donations.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed">
            No donations found.
          </div>
        )}
      </div>
    </div>
  );
}
