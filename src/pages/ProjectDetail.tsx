import { useParams, Link } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Github, ExternalLink, Lock, Sparkles, Calendar } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProject(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-64 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The project you're looking for doesn't exist or is not public.
            </p>
            <Button asChild>
              <Link to="/#projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back button */}
          <Button variant="ghost" className="mb-8" asChild>
            <Link to="/#projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                {project.name}
              </h1>
              {project.status !== "public" && (
                <Badge variant={project.status === "private" ? "destructive" : "secondary"}>
                  {project.status === "private" && <Lock className="w-3 h-3 mr-1" />}
                  {project.status === "beta" && <Sparkles className="w-3 h-3 mr-1" />}
                  {project.status}
                </Badge>
              )}
              {project.featured && (
                <Badge className="bg-gradient-primary">Featured</Badge>
              )}
            </div>
            <p className="text-xl text-muted-foreground">
              {project.short_description}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Image Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <div className="grid gap-4">
                {project.images.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <img
                      src={image}
                      alt={`${project.name} screenshot ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <Card className="p-6 glass mb-8">
            <h2 className="text-2xl font-semibold mb-4">About this project</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {project.description}
            </p>
          </Card>

          {/* Technologies & Tags */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 glass">
              <h3 className="text-lg font-semibold mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech?.map((tech, index) => (
                  <Badge key={index} className="bg-primary/10 text-primary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
            <Card className="p-6 glass">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            {project.github_url && (
              <Button variant="outline" size="lg" asChild>
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View Source Code
                </a>
              </Button>
            )}
            {project.live_url && (
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow" asChild>
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
