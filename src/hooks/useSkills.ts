import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Skill {
  id: string;
  category: string;
  skills: string[];
  display_order: number;
  updated_at: string;
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Skill[];
    }
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (skill: Partial<Skill> & { id: string }) => {
      const { data, error } = await supabase
        .from("skills")
        .update(skill)
        .eq("id", skill.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update skill: ${error.message}`);
    }
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (skill: Omit<Skill, "id" | "updated_at">) => {
      const { data, error } = await supabase
        .from("skills")
        .insert(skill)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill category created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create skill: ${error.message}`);
    }
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete skill: ${error.message}`);
    }
  });
}
