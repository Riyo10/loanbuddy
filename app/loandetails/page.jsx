import { Suspense } from 'react';
import LoanDetails from './LoanDetails';

export default function LoanDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading loan details...</div>}>
      <LoanDetails />
    </Suspense>
  );
}
