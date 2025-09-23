'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  fetchClinicalTrials,
  fetchLanguages,
  fetchCountries,
  OptionCountry,
  OptionLanguage,
  Option,
} from '@/services/digital-wallet-service';

type PhoneEntry = {
  number: string;
  type: 'iPhone' | 'Android';
};

export default function DigitalWallet() {
  const [clinicalTrials, setClinicalTrials] = useState<Option[]>([]);
  const [languages, setLanguages] = useState<OptionLanguage[]>([]);
  const [countryLocaleData, setCountryLocaleData] = useState<OptionLanguage[]>([]);

  const [selectedClinicalTrial, setSelectedClinicalTrial] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const [phones, setPhones] = useState<PhoneEntry[]>([{ number: '', type: 'iPhone' }]);
  const [invalidPhoneIndices, setInvalidPhoneIndices] = useState<number[]>([]);

  const [countries, setCountries] = useState<OptionCountry[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      const clinicalData = await fetchClinicalTrials();
      if (clinicalData.length) setClinicalTrials(clinicalData);

      const countryData = await fetchCountries();
      if (countryData.length) setCountries(countryData);

      const localeData = await fetchLanguages();
      if (localeData.length) setCountryLocaleData(localeData);
    }

    fetchOptions();
  }, []);

  // ✅ Country → Language filter (with deduplication + correct typing)
  useEffect(() => {
    if (!selectedCountry) {
      setLanguages([]);
      setSelectedLanguage('');
      return;
    }

    const filteredLanguages = countryLocaleData.filter(
      (entry) => entry.countryname === selectedCountry
    );

    const uniqueLanguages: OptionLanguage[] = Array.from(
      new Map(filteredLanguages.map((lang) => [lang.language, lang])).values()
    );

    setLanguages(uniqueLanguages);
    setSelectedLanguage('');
  }, [selectedCountry, countryLocaleData]);

  const validatePhoneNumber = (num: string) => {
  const phoneRegex = /^[0-9]{10}$/; // only 10 digits
  return phoneRegex.test(num);
};

  const handlePhoneChange = (index: number, field: keyof PhoneEntry, value: string) => {
    const updatedPhones = [...phones];
    if (field === 'type') {
      updatedPhones[index].type = value as 'iPhone' | 'Android';
    } else {
      updatedPhones[index].number = value;
    }

    if (field === 'number') {
      if (!validatePhoneNumber(value)) {
        if (!invalidPhoneIndices.includes(index)) {
          setInvalidPhoneIndices((prev) => [...prev, index]);
          toast.error(`Invalid Mobile number format`);
        }
      } else {
        setInvalidPhoneIndices((prev) => prev.filter((i) => i !== index));
      }
    }

    setPhones(updatedPhones);
  };

  const handlePhoneBlur = (index: number) => {
  const phone = phones[index].number;

  if (!validatePhoneNumber(phone)) {
    if (!invalidPhoneIndices.includes(index)) {
      setInvalidPhoneIndices((prev) => [...prev, index]);
      toast.error(`Mobile number must be exactly 10 digits`);
    }
  } else {
    setInvalidPhoneIndices((prev) => prev.filter((i) => i !== index));
  }
};

  const addPhone = () => {
    if (phones.length < 5) {
      setPhones([...phones, { number: '', type: 'iPhone' }]);
    }
  };

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
      setInvalidPhoneIndices((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let formHasError = false;

    if (!selectedClinicalTrial) {
      toast.error('Please select a Clinical Trial.');
      formHasError = true;
    }

    if (!selectedCountry) {
      toast.error('Please select a Country.');
      formHasError = true;
    }

    if (!selectedLanguage) {
      toast.error('Please select a Language.');
      formHasError = true;
    }

    const invalids: number[] = [];

    phones.forEach((phone, idx) => {
      if (!validatePhoneNumber(phone.number)) {
        invalids.push(idx);
        toast.error(`Invalid Mobile Number Format`);
        formHasError = true;
      }
    });

    if (formHasError) {
      setInvalidPhoneIndices(invalids);
      return;
    }

    setInvalidPhoneIndices([]);
    toast.success('Copay cards/vouchers Sent Successfully');
    // TODO: Implement real submission logic
  };

  return (
    <>
      <Head>
        <title>Lilly Digital Wallet</title>
      </Head>

      <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
        <Toaster position="top-right" />

        {/* Header */}
        <header className="flex items-center justify-between bg-white p-3 text-red-600 relative">
          <div className="flex items-center space-x-4">
            <img src="/lilly-logo.png" alt="Lilly Logo" className="h-12 w-auto" />
          </div>

          <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-red">
            Digital Wallet Portal
          </h1>

          <div className="relative group cursor-pointer">
            <img
              src="/profile-avatar.png"
              alt="User Profile"
              className="h-8 w-8 rounded-full border-2 border-white"
            />
            <div className="absolute right-0 mt-2 w-max bg-white text-black text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto p-2 z-10">
              <p className="font-semibold">John Doe</p>
              <p className="text-xs">john.doe@example.com</p>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
          <form onSubmit={handleSubmit} noValidate>
            {/* Clinical Trial Dropdown */}
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="clinical-trial">
                Clinical Trial
              </label>
              <select
                id="clinical-trial"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedClinicalTrial}
                onChange={(e) => setSelectedClinicalTrial(e.target.value)}
                required
              >
                <option value="">-- Select Clinical Trial --</option>
                {clinicalTrials.map((ct) => (
                  <option key={ct.id} value={ct.name}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Dropdown */}
            <div className="mb-4">
              <label className="block font-semibold mb-1" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                required
              >
                <option value="">-- Select Country --</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.countryname}>
                    {country.countryname}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Dropdown */}
            <div className="mb-6">
              <label className="block font-semibold mb-1" htmlFor="language">
                Language
              </label>
              <select
                id="language"
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                required
              >
                <option value="">-- Select Language --</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.language}>
                    {lang.language}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Inputs */}
            {phones.map((phone, index) => (
              <div key={index} className="mb-4 flex items-center gap-2">
                <input
                  type="tel"
                  inputMode="tel"
                  pattern="\+?[0-9\s-]{7,15}"
                  placeholder="Mobile Number"
                  value={phone.number}
                  onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                  onBlur={() => handlePhoneBlur(index)}
                  className={`flex-1 p-2 border rounded ${
                    invalidPhoneIndices.includes(index) ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {index === phones.length - 1 && phones.length < 5 && (
                  <button
                    type="button"
                    onClick={addPhone}
                    className="px-3 py-1 bg-gray-500 text-white rounded whitespace-nowrap"
                  >
                    Add More
                  </button>
                )}
                {phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded whitespace-nowrap"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </main>

        <footer className="mt-6 bg-red-600 p-4 text-center text-sm text-white">
          <a href="#" className="mx-3 hover:underline">
            Contact us
          </a>
          <a href="#" className="mx-3 hover:underline">
            Terms of Use
          </a>
          <a href="#" className="mx-3 hover:underline">
            Privacy Statement
          </a>
        </footer>
      </div>
    </>
  );
}
