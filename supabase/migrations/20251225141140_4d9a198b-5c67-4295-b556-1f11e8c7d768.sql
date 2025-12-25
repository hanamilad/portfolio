-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  images TEXT[] DEFAULT '{}',
  tech TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  status TEXT DEFAULT 'public' CHECK (status IN ('public', 'private', 'beta', 'upcoming')),
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create about content table
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experience table
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  from_date TEXT NOT NULL,
  to_date TEXT,
  details TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact info table
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  location TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Public read policies for portfolio visitors
CREATE POLICY "Anyone can view public projects" ON public.projects FOR SELECT USING (status = 'public');
CREATE POLICY "Anyone can view about content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Anyone can view contact info" ON public.contact_info FOR SELECT USING (true);

-- Admin policies (authenticated users can manage all content)
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage about" ON public.about_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage contact" ON public.contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage policies for project images
CREATE POLICY "Anyone can view project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can upload project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can update project images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can delete project images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default about content
INSERT INTO public.about_content (name, title, bio, image_url, github_url, linkedin_url, email)
VALUES ('Hanna', 'Fullstack Developer', 'Fullstack developer passionate about building scalable applications with modern technologies. Experienced in both frontend and backend development, with a focus on creating elegant solutions to complex problems.', '/img/profile.jpg', 'https://github.com/username', 'https://linkedin.com/in/username', 'email@example.com');

-- Insert default skills
INSERT INTO public.skills (category, skills, display_order) VALUES 
('frontend', ARRAY['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind CSS'], 1),
('backend', ARRAY['PHP', 'Laravel', 'Node.js', 'Express', 'Python', 'REST APIs'], 2),
('databases', ARRAY['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'], 3),
('tools', ARRAY['Git', 'GitHub', 'VS Code', 'Postman', 'Figma'], 4),
('devops', ARRAY['Docker', 'CI/CD', 'Nginx', 'Linux', 'AWS'], 5),
('other', ARRAY['Problem Solving', 'System Design', 'Agile', 'Team Leadership'], 6);

-- Insert default contact info
INSERT INTO public.contact_info (email, phone, location)
VALUES ('email@example.com', '+20123456789', 'Egypt');

-- Insert sample projects
INSERT INTO public.projects (slug, name, description, short_description, images, tech, tags, github_url, live_url, status, display_order, featured)
VALUES 
('ecommerce-platform', 'E-Commerce Platform', 'A full-featured e-commerce platform with user authentication, product management, shopping cart, and payment integration. Built with modern technologies for optimal performance and user experience.', 'Modern e-commerce solution with full shopping features', ARRAY['/img/projects/project1.jpg'], ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], ARRAY['Web App', 'E-Commerce'], 'https://github.com/username/ecommerce', 'https://ecommerce-demo.com', 'public', 1, true),
('task-management', 'Task Management App', 'A collaborative task management application with real-time updates, team workspaces, and project tracking. Features drag-and-drop interface and deadline notifications.', 'Collaborative task tracking with real-time sync', ARRAY['/img/projects/project2.jpg'], ARRAY['Vue.js', 'Laravel', 'MySQL', 'WebSockets'], ARRAY['Productivity', 'SaaS'], 'https://github.com/username/taskmanager', 'https://tasks-demo.com', 'public', 2, true),
('portfolio-builder', 'Portfolio Builder', 'A drag-and-drop portfolio builder for developers and designers. Includes customizable templates, SEO optimization, and one-click deployment.', 'Drag-and-drop portfolio creation tool', ARRAY['/img/projects/project3.jpg'], ARRAY['React', 'TypeScript', 'Tailwind', 'Supabase'], ARRAY['Developer Tools'], 'https://github.com/username/portfolio-builder', 'https://portfolio-builder-demo.com', 'public', 3, false),
('ai-chat-assistant', 'AI Chat Assistant', 'An intelligent chat assistant powered by advanced language models. Supports multiple languages and integrates with various platforms.', 'Smart AI-powered chat interface', ARRAY['/img/projects/project4.jpg'], ARRAY['Python', 'FastAPI', 'React', 'OpenAI'], ARRAY['AI', 'Chat'], '', '', 'beta', 4, false),
('fitness-tracker', 'Fitness Tracker', 'A comprehensive fitness tracking app with workout plans, progress visualization, and social features. Syncs with popular fitness devices.', 'Complete fitness and workout companion', ARRAY['/img/projects/project5.jpg'], ARRAY['React Native', 'Node.js', 'MongoDB'], ARRAY['Health', 'Mobile'], 'https://github.com/username/fitness', '', 'public', 5, false),
('blog-cms', 'Blog CMS', 'A headless CMS for bloggers with markdown support, SEO tools, and analytics dashboard. Fast and developer-friendly.', 'Modern headless CMS for content creators', ARRAY['/img/projects/project6.jpg'], ARRAY['Next.js', 'GraphQL', 'PostgreSQL'], ARRAY['CMS', 'Developer Tools'], 'https://github.com/username/blog-cms', 'https://blog-cms-demo.com', 'public', 6, false);

-- Insert sample experience
INSERT INTO public.experience (company, role, from_date, to_date, details, display_order)
VALUES 
('Tech Innovations Inc.', 'Senior Fullstack Developer', '2022', 'Present', ARRAY['Led development of microservices architecture serving 1M+ users', 'Mentored junior developers and conducted code reviews', 'Implemented CI/CD pipelines reducing deployment time by 60%', 'Designed and built RESTful APIs for mobile applications'], 1),
('Digital Solutions Ltd.', 'Fullstack Developer', '2020', '2022', ARRAY['Built and maintained e-commerce platforms using Laravel and Vue.js', 'Optimized database queries improving performance by 40%', 'Integrated third-party payment gateways and APIs', 'Collaborated with design team to implement responsive UIs'], 2),
('StartUp Hub', 'Junior Developer', '2018', '2020', ARRAY['Developed web applications using PHP and JavaScript', 'Participated in agile development processes', 'Created documentation for internal tools and APIs', 'Assisted in database design and optimization'], 3);