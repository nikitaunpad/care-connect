import { Suspense } from 'react';

import { ResetPasswordForm } from './reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center text-[#193C1F]">
          Loading reset password page...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
