// app/components/types.tsx
export type Status = 'fail' | 'success' | 'undelivered';

export interface WalletInvite {
  id: string;
  trial: string;
  language: string;
  mobile: string;
  country: string;
  cardId: string;
  requestId: string;
  sentDate: string;
  status: Status;
}

export interface WalletInvitesTableProps {
  data: WalletInvite[];
  onResend: (id: string) => void;
}
