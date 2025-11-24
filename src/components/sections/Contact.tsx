import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loadData } from "@/lib/dataLoader";
import { CONFIG } from "@/config";
import * as Icons from "lucide-react";

interface ContactData {
  email: string;
  phone: string;
  location: string;
  availability: string;
  social: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  formConfig: {
    title: string;
    subtitle: string;
    submitText: string;
    successMessage: string;
    errorMessage: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      placeholder: string;
      required: boolean;
    }>;
  };
}

export default function Contact() {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData("contact")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (CONFIG.use_api && CONFIG.base_url) {
        // When API is connected, this would make an actual request
        toast.success(data?.formConfig.successMessage);
      } else {
        // Show backend not connected message
        toast.info(data?.formConfig.errorMessage);
      }

      // Reset form
      setFormData({});
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
    <section id="contact" className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6 glass">
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icons.Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href={`mailto:${data.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {data.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icons.Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a
                      href={`tel:${data.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {data.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icons.MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{data.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icons.Briefcase className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-muted-foreground">{data.availability}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-border">
                <p className="font-medium mb-4">Connect With Me</p>
                <div className="flex gap-3">
                  {data.social.map((social, index) => {
                    const IconComponent = (Icons as any)[social.icon] || Icons.Link;
                    return (
                      <Button
                        key={index}
                        size="icon"
                        variant="outline"
                        className="hover:bg-primary hover:text-primary-foreground transition-all"
                        asChild
                      >
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={social.platform}
                        >
                          <IconComponent className="w-5 h-5" />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <Card className="p-6 glass">
              <h3 className="text-2xl font-semibold mb-2">
                {data.formConfig.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {data.formConfig.subtitle}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {data.formConfig.fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        rows={5}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : data.formConfig.submitText}
                </Button>

                {!CONFIG.use_api && (
                  <p className="text-sm text-muted-foreground text-center">
                    ℹ️ This form is UI-only. Backend integration ready via config.
                  </p>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
