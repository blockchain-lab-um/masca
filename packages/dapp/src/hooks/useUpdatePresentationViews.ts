import { supabaseServiceRoleClient } from '@/utils/supabase/supabaseServiceRoleClient';

export const useUpdatePresentationViews = async (id: string) => {
  const supabase = supabaseServiceRoleClient();

  // Update views
  await supabase.rpc('increment_presentation_views', {
    presentation_id: id,
  });
};
