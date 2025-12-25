import { Card } from "@/components/ui/card";
import { useAbout } from "@/hooks/useAbout";
import { usePublicProjects } from "@/hooks/useProjects";
import { useExperience } from "@/hooks/useExperience";

export default function About() {
  const { data, isLoading } = useAbout();
  const { data: projects } = usePublicProjects();
  const { data: experience } = useExperience();

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  // Calculate dynamic stats
  const yearsOfExperience = experience?.length 
    ? new Date().getFullYear() - parseInt(experience[experience.length - 1]?.from_date || "2020")
    : 5;
  const projectCount = projects?.length || 0;

  const stats = [
    { label: "Years Experience", value: `${yearsOfExperience}+` },
    { label: "Projects Completed", value: `${projectCount}+` },
    { label: "Technologies", value: "20+" },
    { label: "Happy Clients", value: "15+" },
  ];

  return (
    <section id="about" className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative">
              <img
                src={data.image_url || "/img/profile.jpg"}
                alt={data.name}
                className="w-full aspect-square object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {data.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-6 glass hover:shadow-glow transition-all duration-300"
                >
                  <div className="text-center">
                    <p className="text-3xl font-bold gradient-text mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
