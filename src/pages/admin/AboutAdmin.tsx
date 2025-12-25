import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAbout, useUpdateAbout } from "@/hooks/useAbout";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import { Save } from "lucide-react";

export default function AboutAdmin() {
  const { data: about, isLoading } = useAbout();
  const updateAbout = useUpdateAbout();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    image_url: "",
    github_url: "",
    linkedin_url: "",
    email: "",
    resume_url: "",
    years_experience: 5,
    technologies_count: 20,
    happy_clients: 15,
  });

  useEffect(() => {
    if (about) {
      setFormData({
        name: about.name || "",
        title: about.title || "",
        bio: about.bio || "",
        image_url: about.image_url || "",
        github_url: about.github_url || "",
        linkedin_url: about.linkedin_url || "",
        email: about.email || "",
        resume_url: about.resume_url || "",
        years_experience: about.years_experience ?? 5,
        technologies_count: about.technologies_count ?? 20,
        happy_clients: about.happy_clients ?? 15,
      });
    }
  }, [about]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about?.id) return;

    await updateAbout.mutateAsync({
      id: about.id,
      ...formData,
    });
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">About</h1>
        <p className="text-muted-foreground">
          Update your personal information and bio
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Image */}
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onRemove={() => setFormData({ ...formData, image_url: "" })}
                folder="profile"
                aspectRatio="square"
              />
            </div>

            {/* Name & Title */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Fullstack Developer"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={6}
                  placeholder="Tell visitors about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label>Resume / CV</Label>
            <FileUpload
              value={formData.resume_url}
              onChange={(url) => setFormData({ ...formData, resume_url: url })}
              onRemove={() => setFormData({ ...formData, resume_url: "" })}
              folder="resume"
              label="Upload your resume"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-xs text-muted-foreground">
              This will appear as a download button on your portfolio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">إحصائيات القسم</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="years_experience">سنوات الخبرة</Label>
                <Input
                  id="years_experience"
                  type="number"
                  min="0"
                  value={formData.years_experience}
                  onChange={(e) =>
                    setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technologies_count">عدد التقنيات</Label>
                <Input
                  id="technologies_count"
                  type="number"
                  min="0"
                  value={formData.technologies_count}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies_count: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="happy_clients">العملاء السعداء</Label>
                <Input
                  id="happy_clients"
                  type="number"
                  min="0"
                  value={formData.happy_clients}
                  onChange={(e) =>
                    setFormData({ ...formData, happy_clients: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              عدد المشاريع يتم حسابه تلقائياً من المشاريع المضافة
            </p>
          </div>

          <Button
            type="submit"
            className="bg-gradient-primary"
            disabled={updateAbout.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {updateAbout.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
