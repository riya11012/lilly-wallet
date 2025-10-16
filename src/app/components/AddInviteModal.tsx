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
  const [showMobileSlide, setShowMobileSlide] = useState(false);

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
    console.log({ trial, country, language, mobiles });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl relative overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-2xl font-semibold hover:text-black z-10"
          onClick={onClose}
        >
          ×
        </button>

        <div className="relative h-[80vh] overflow-hidden">
          {/* Centered three-lines button between both columns */}
          <button
            type="button"
            onClick={() => setShowMobileSlide(true)}
            className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center border rounded-full bg-gray-50 hover:bg-gray-100 transition-colors z-10"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="3" y="6" width="18" height="2" rx="1" fill="#1f2937" />
              <rect x="3" y="11" width="18" height="2" rx="1" fill="#1f2937" />
              <rect x="3" y="16" width="18" height="2" rx="1" fill="#1f2937" />
            </svg>
          </button>

          {/* Main content: two columns (Demographics + Mobile) */}
          <div className="flex h-full">
            {/* Left: Demographics */}
            <div className="w-1/2 h-full bg-white p-6 overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Invites</h2>

              {/* Demographics form */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">1</span>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Select Demographics</h3>
                </div>

            <div>
                  <label className="block text-sm font-medium mb-1">Clinical Trial</label>
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
                  <label className="block text-sm font-medium mb-1">Country/Region</label>
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
                  <label className="block text-sm font-medium mb-1">Language</label>
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
            </div>
            {/* Right: Mobile (visible on main) */}
            <div className="w-1/2 h-full bg-gray-100 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">2</span>
                <span className="text-xs text-gray-500">(up to 10 numbers)</span>
              </div>

              <div className="overflow-y-auto flex-1 pr-2">
            {mobiles.map((mobile, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500 w-6 text-right">{index + 1}</span>
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

            {mobiles.length < 10 && (
              <button
                type="button"
                onClick={handleAddMobile}
                    className="text-blue-600 text-sm flex items-center gap-1 hover:underline mt-2"
              >
                <span>➕</span> Add mobile
              </button>
            )}
          </div>

              <div className="pt-3 mt-2 text-right shrink-0">
          <button
                  onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
          >
            Submit →
          </button>
              </div>
            </div>
          </div>

          {/* Slide-in Mobile overlay */}
          <div
            className="absolute inset-0 bg-gray-100 p-6 transition-transform duration-300 ease-in-out flex flex-col"
            style={{ transform: showMobileSlide ? 'translateX(0%)' : 'translateX(100%)' }}
          >
            <div className="flex items-center justify-between mb-4 shrink-0">
              <button
                type="button"
                onClick={() => setShowMobileSlide(false)}
                className="text-sm text-gray-700 hover:underline"
              >
                ← Back
              </button>
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Mobile</span>
            </div>

            <div className="overflow-y-auto flex-1 pr-2">
              {mobiles.map((mobile, index) => (
                <div key={index} className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500 w-6 text-right">{index + 1}</span>
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

              {mobiles.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddMobile}
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline mt-2"
                >
                  <span>➕</span> Add mobile
                </button>
              )}
            </div>

            <div className="pt-4 text-right shrink-0">
              <button
                onClick={handleSubmit}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
              >
                Submit →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInviteModal;