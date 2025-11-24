import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { loadData } from "@/lib/dataLoader";
import * as Icons from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

interface SkillsData {
  categories: SkillCategory[];
}

export default function Skills() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData("skills")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  if (!data) return null;

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
          {data.categories.map((category, index) => {
            const IconComponent = (Icons as any)[category.icon] || Icons.Code;

            return (
              <Card
                key={index}
                className="p-6 glass hover:shadow-glow transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-gradient-primary">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
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
