import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { useAbout } from "@/hooks/useAbout";

export default function Footer() {
  const { data: about } = useAbout();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              &lt;/&gt; Portfolio
            </h3>
            <p className="text-muted-foreground">
              Building digital experiences with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About", "Skills", "Projects", "Experience", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              {about?.github_url && (
                <Button
                  size="icon"
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-all"
                  asChild
                >
                  <a href={about.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {about?.linkedin_url && (
                <Button
                  size="icon"
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-all"
                  asChild
                >
                  <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {about?.email && (
                <Button
                  size="icon"
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-all"
                  asChild
                >
                  <a href={`mailto:${about.email}`}>
                    <Mail className="w-5 h-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {about?.name || "Portfolio"}. All rights reserved. Built
            with React & TypeScript.
          </p>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          size="icon"
          className="fixed bottom-8 right-8 rounded-full bg-gradient-primary shadow-glow hover:shadow-glow-secondary transition-all animate-fade-in"
          onClick={scrollToTop}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </footer>
  );
}
