import { supabase } from '@/lib/supabaseClient'

export type Option = {
  id: number;
  name: string;  
};

export type OptionCountry = {
  id: number;
  countryname: string;  
};

export type OptionLanguage= {
  id: number;
  language: string;  
  countryname: string;
};

export async function fetchClinicalTrials(): Promise<Option[]> {
  const { data, error } = await supabase.from('clinicaltrials').select('id, name');

  if (error) {
    console.error('Error fetching clinical trials:');
    console.error('Message:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
    console.error('Code:', error.code);
     console.error('Code1:', error.code);
    return [];
  }

  return data ?? [];
}

export async function fetchLanguages(): Promise<OptionLanguage[]> {
  const { data, error } = await supabase.from('countrylocale').select('*');

  if (error) {
    console.error('Error fetching languages:', error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchCountries(): Promise<OptionCountry[]> {
  const { data, error } = await supabase.from('countrylocale').select('id, countryname');

  if (error) {
    console.error('Error fetching countries:', error.message);
    return [];
  }

  return data ?? [];
}
