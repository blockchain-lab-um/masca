import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';
import type { VerifiablePresentation } from '@veramo/core';

export const usePresentation = async (id: string) => {
  const supabase = supabaseServiceRoleClient();

  // Query the presentation
  const { data, error } = await supabase
    .from('presentations')
    .select()
    .eq('id', id)
    .limit(1);

  if (!data || data.length === 0 || error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data: {
      presentation: data[0].presentation as VerifiablePresentation,
      title: data[0].title,
    },
    error: null,
  };
};
