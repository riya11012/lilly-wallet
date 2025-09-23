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
      className={`text-blue-600 font-semibold ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
    >
      resend
    </button>
  );
};

export default ResendButton;
