import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useExperience,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
  Experience,
} from "@/hooks/useExperience";
import { Plus, Pencil, Trash2, X, Briefcase } from "lucide-react";

export default function ExperienceAdmin() {
  const { data: experiences, isLoading } = useExperience();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [deletingExp, setDeletingExp] = useState<Experience | null>(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    from_date: "",
    to_date: "",
    details: [] as string[],
  });
  const [newDetail, setNewDetail] = useState("");

  const openCreateDialog = () => {
    setEditingExp(null);
    setFormData({
      company: "",
      role: "",
      from_date: "",
      to_date: "",
      details: [],
    });
    setDialogOpen(true);
  };

  const openEditDialog = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      from_date: exp.from_date,
      to_date: exp.to_date || "",
      details: exp.details || [],
    });
    setDialogOpen(true);
  };

  const addDetail = () => {
    if (newDetail.trim()) {
      setFormData({
        ...formData,
        details: [...formData.details, newDetail.trim()],
      });
      setNewDetail("");
    }
  };

  const removeDetail = (index: number) => {
    setFormData({
      ...formData,
      details: formData.details.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expData = {
      ...formData,
      to_date: formData.to_date || null,
      display_order: editingExp?.display_order || (experiences?.length || 0) + 1,
    };

    if (editingExp) {
      await updateExperience.mutateAsync({ id: editingExp.id, ...expData });
    } else {
      await createExperience.mutateAsync(expData);
    }

    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deletingExp) {
      await deleteExperience.mutateAsync(deletingExp.id);
      setDeleteDialogOpen(false);
      setDeletingExp(null);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground">Manage your work experience</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExp ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from_date">From *</Label>
                  <Input
                    id="from_date"
                    value={formData.from_date}
                    onChange={(e) =>
                      setFormData({ ...formData, from_date: e.target.value })
                    }
                    placeholder="2020"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to_date">To (leave empty for current)</Label>
                  <Input
                    id="to_date"
                    value={formData.to_date}
                    onChange={(e) =>
                      setFormData({ ...formData, to_date: e.target.value })
                    }
                    placeholder="2024 or Present"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Responsibilities / Achievements</Label>
                <div className="flex gap-2">
                  <Input
                    value={newDetail}
                    onChange={(e) => setNewDetail(e.target.value)}
                    placeholder="Add a responsibility..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addDetail();
                      }
                    }}
                  />
                  <Button type="button" onClick={addDetail} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-muted rounded"
                    >
                      <span className="text-primary mt-0.5">▹</span>
                      <span className="flex-1 text-sm">{detail}</span>
                      <button
                        type="button"
                        onClick={() => removeDetail(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-primary"
                  disabled={createExperience.isPending || updateExperience.isPending}
                >
                  {editingExp ? "Update" : "Add"} Experience
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences?.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No experience added yet</p>
            <Button onClick={openCreateDialog}>Add your first experience</Button>
          </Card>
        ) : (
          experiences?.map((exp) => (
            <Card key={exp.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exp.from_date} - {exp.to_date || "Present"}
                    </p>
                    {exp.details && exp.details.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {exp.details.map((detail, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="text-primary">▹</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(exp)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setDeletingExp(exp);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingExp?.role} at{" "}
              {deletingExp?.company}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
