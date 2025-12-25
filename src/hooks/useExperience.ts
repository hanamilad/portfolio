import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Experience {
  id: string;
  company: string;
  role: string;
  from_date: string;
  to_date: string | null;
  details: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useExperience() {
  return useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Experience[];
    }
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (exp: Partial<Experience> & { id: string }) => {
      const { data, error } = await supabase
        .from("experience")
        .update(exp)
        .eq("id", exp.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update experience: ${error.message}`);
    }
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (exp: Omit<Experience, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("experience")
        .insert(exp)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create experience: ${error.message}`);
    }
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("experience")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Experience deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete experience: ${error.message}`);
    }
  });
}
