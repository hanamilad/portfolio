import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function useContactMessages() {
  return useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ContactMessage[];
    }
  });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const { data, error } = await supabase
        .from("contact_messages")
        .update({ read })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    }
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast.success("Message deleted");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    }
  });
}

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      const response = await supabase.functions.invoke("send-contact-notification", {
        body: data,
      });
      
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    }
  });
}
