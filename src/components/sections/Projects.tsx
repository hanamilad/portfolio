import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Lock, Sparkles, Eye } from "lucide-react";
import { usePublicProjects } from "@/hooks/useProjects";

export default function Projects() {
  const { data, isLoading } = usePublicProjects();
  const [filter, setFilter] = useState<"all" | "featured">("all");

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  const filteredProjects = filter === "featured" 
    ? data?.filter(p => p.featured) 
    : data;

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mb-8" />
          
          <div className="flex gap-2 justify-center">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-gradient-primary" : ""}
            >
              All Projects
            </Button>
            <Button
              variant={filter === "featured" ? "default" : "outline"}
              onClick={() => setFilter("featured")}
              className={filter === "featured" ? "bg-gradient-primary" : ""}
            >
              Featured
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects?.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden glass hover:shadow-glow transition-all duration-300 group"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.images?.[0] || "/placeholder.svg"}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {project.status !== "public" && (
                  <div className="absolute top-4 right-4">
                    <Badge variant={project.status === "private" ? "destructive" : "secondary"}>
                      {project.status === "private" && <Lock className="w-3 h-3 mr-1" />}
                      {project.status === "beta" && <Sparkles className="w-3 h-3 mr-1" />}
                      {project.status}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                
                <p className="text-muted-foreground line-clamp-3">
                  {project.short_description || project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((tech, index) => (
                    <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/projects/${project.slug}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Link>
                  </Button>
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {project.live_url && (
                    <Button size="sm" className="bg-gradient-primary" asChild>
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
