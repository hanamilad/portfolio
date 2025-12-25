import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AboutContent {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  image_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  resume_url: string | null;
  updated_at: string;
}

export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as AboutContent | null;
    }
  });
}

export function useUpdateAbout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (about: Partial<AboutContent> & { id: string }) => {
      const { data, error } = await supabase
        .from("about_content")
        .update(about)
        .eq("id", about.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About content updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update about: ${error.message}`);
    }
  });
}
