// StatusBadge.tsx
import React from 'react';
import { Status } from '../components/types';

const statusColors: Record<Status, string> = {
  fail: 'bg-red-500',
  success: 'bg-green-500',
  undelivered: 'bg-yellow-500',
};

type Props = {
  status: Status;
};

const StatusBadge: React.FC<Props> = ({ status }) => (
  <span className={`inline-flex items-center gap-2`}>
    <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
    <span className="capitalize text-sm text-gray-700">{status}</span>
  </span>
);

export default StatusBadge;
