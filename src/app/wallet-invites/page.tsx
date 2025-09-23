// app/wallet-invites/page.tsx
'use client';

import React from 'react';
import WalletInvitesTable from '../components/wallet-invites-table';
import { sampleData } from './sampleData';

export default function WalletInvitesPage() {
  const handleResend = (id: string) => {
    alert(`Resend invite with ID: ${id}`);
  };

  return <WalletInvitesTable data={sampleData} onResend={handleResend} />;
}
