// ResendButton.tsx
import React from 'react';
import { Status } from '../components/types';

type Props = {
  status: Status;
  onResend: () => void;
};

const ResendButton: React.FC<Props> = ({ status, onResend }) => {
  const disabled = status === 'success';
  return (
    <button
      disabled={disabled}
      onClick={onResend}
      className={`text-blue-600 text-sm font-medium flex items-center gap-1 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
    >
      <span>resend</span>
      <span className="text-xs">↻</span>
    </button>
  );
};

export default ResendButton;
