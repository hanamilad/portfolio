import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAbout, useUpdateAbout } from "@/hooks/useAbout";
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

          <div className="space-y-2">
            <Label htmlFor="image_url">Profile Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="/img/profile.jpg or https://..."
            />
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
            )}
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
