import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar } from "lucide-react";
import { useExperience } from "@/hooks/useExperience";

export default function Experience() {
  const { data, isLoading } = useExperience();

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
    <section id="experience" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-primary hidden md:block" />

          <div className="space-y-12">
            {data.map((item, index) => {
              const isCurrent = !item.to_date || item.to_date.toLowerCase() === "present";
              
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-2 md:-translate-x-2 mt-6 border-4 border-background hidden md:block" />

                  {/* Content */}
                  <div className="flex-1">
                    <Card className="p-6 glass hover:shadow-glow transition-all duration-300 group">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {item.role}
                          </h3>
                          <p className="text-lg text-primary font-medium mb-2">
                            {item.company}
                          </p>
                        </div>
                        {isCurrent && (
                          <Badge className="bg-gradient-primary">Current</Badge>
                        )}
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {item.from_date} - {item.to_date || "Present"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>Full-time</span>
                        </div>
                      </div>

                      {/* Details */}
                      {item.details && item.details.length > 0 && (
                        <ul className="space-y-2">
                          {item.details.map((detail, detailIndex) => (
                            <li
                              key={detailIndex}
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <span className="text-primary mt-1">▹</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Card>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
