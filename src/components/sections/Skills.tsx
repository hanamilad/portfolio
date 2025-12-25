import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSkills } from "@/hooks/useSkills";
import { Code, Server, Database, Wrench, Cloud, Lightbulb } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  frontend: Code,
  backend: Server,
  databases: Database,
  tools: Wrench,
  devops: Cloud,
  other: Lightbulb,
};

export default function Skills() {
  const { data, isLoading } = useSkills();

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <section id="skills" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((category) => {
            const IconComponent = categoryIcons[category.category.toLowerCase()] || Code;

            return (
              <Card
                key={category.id}
                className="p-6 glass hover:shadow-glow transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-primary">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold capitalize">{category.category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills?.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="outline"
                      className="hover:bg-primary/10 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
