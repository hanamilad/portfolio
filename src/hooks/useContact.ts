import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContactInfo {
  id: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  updated_at: string;
}

export function useContact() {
  return useQuery({
    queryKey: ["contact"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as ContactInfo | null;
    }
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: Partial<ContactInfo> & { id: string }) => {
      const { data, error } = await supabase
        .from("contact_info")
        .update(contact)
        .eq("id", contact.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      toast.success("Contact info updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    }
  });
}
