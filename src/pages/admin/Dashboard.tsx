import { Card } from "@/components/ui/card";
import { useProjects } from "@/hooks/useProjects";
import { useSkills } from "@/hooks/useSkills";
import { useExperience } from "@/hooks/useExperience";
import { FolderKanban, Code, Briefcase, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: experience } = useExperience();

  const stats = [
    {
      name: "Projects",
      value: projects?.length || 0,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-500",
    },
    {
      name: "Skill Categories",
      value: skills?.length || 0,
      icon: Code,
      href: "/admin/skills",
      color: "text-green-500",
    },
    {
      name: "Experience",
      value: experience?.length || 0,
      icon: Briefcase,
      href: "/admin/experience",
      color: "text-purple-500",
    },
    {
      name: "Public Projects",
      value: projects?.filter((p) => p.status === "public").length || 0,
      icon: Eye,
      href: "/admin/projects",
      color: "text-orange-500",
    },
  ];

  const recentProjects = projects?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.name} to={stat.href}>
            <Card className="p-6 hover:shadow-glow transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div
                  className={`p-3 rounded-lg bg-muted group-hover:scale-110 transition-transform ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Link
            to="/admin/projects"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {recentProjects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No projects yet. Create your first project!
            </p>
          ) : (
            recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  {project.images?.[0] && (
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {project.short_description}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    project.status === "public"
                      ? "bg-green-500/10 text-green-500"
                      : project.status === "beta"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
