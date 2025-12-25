import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAbout } from "@/hooks/useAbout";

export default function Hero() {
  const { data, isLoading } = useAbout();

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-gradient">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Greeting */}
          <div className="animate-fade-in">
            <p className="text-primary font-medium text-lg mb-2">Hello, I'm</p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold gradient-text mb-4">
              {data.name}
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              {data.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {data.bio?.split('.')[0]}.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              className="group bg-gradient-primary hover:shadow-glow transition-all duration-300"
              asChild
            >
              <a href="#contact">
                Get In Touch
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group border-2"
              asChild
            >
              <a href="#projects">
                View Projects
                <Download className="ml-2 group-hover:translate-y-1 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {data.github_url && (
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary hover:text-primary-foreground transition-all"
                asChild
              >
                <a href={data.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </a>
              </Button>
            )}
            {data.linkedin_url && (
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary hover:text-primary-foreground transition-all"
                asChild
              >
                <a href={data.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
            )}
            {data.email && (
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-primary hover:text-primary-foreground transition-all"
                asChild
              >
                <a href={`mailto:${data.email}`}>
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
