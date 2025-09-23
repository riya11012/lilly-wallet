'use client';

import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddInviteModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [trial, setTrial] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [mobiles, setMobiles] = useState(['']);

  if (!isOpen) return null;

  const handleMobileChange = (index: number, value: string) => {
    const updated = [...mobiles];
    updated[index] = value;
    setMobiles(updated);
  };

  const handleAddMobile = () => {
    if (mobiles.length < 10) {
      setMobiles([...mobiles, '']);
    }
  };

  const handleRemoveMobile = (index: number) => {
    const updated = mobiles.filter((_, i) => i !== index);
    setMobiles(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send data to API or parent
    console.log({ trial, country, language, mobiles });
    onClose(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-2xl font-semibold hover:text-black"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Entries</h2>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
          {/* LEFT COLUMN: Demographics */}
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">1 Select Demographics</h3>

            <div>
              <label className="block text-sm mb-1">Clinical Trial</label>
              <select
                value={trial}
                onChange={(e) => setTrial(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="Trial A">Trial A</option>
                <option value="Trial B">Trial B</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Country/region</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>

          {/* RIGHT COLUMN: Mobile */}
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">
              2 Add Mobile <span className="text-xs text-gray-500">(up to 10 numbers)</span>
            </h3>

            {mobiles.map((mobile, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-6">{index + 1}</span>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => handleMobileChange(index, e.target.value)}
                  placeholder="(000) 000 - 0000"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                />
                {mobiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMobile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    🗑
                  </button>
                )}
              </div>
            ))}

            {/* Add Mobile Button */}
            {mobiles.length < 10 && (
              <button
                type="button"
                onClick={handleAddMobile}
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <span>➕</span> Add mobile
              </button>
            )}
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            form="add-invite-form"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
          >
            Submit →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInviteModal;
