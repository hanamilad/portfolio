-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a message (public form)
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view messages
CREATE POLICY "Authenticated users can view messages"
ON public.contact_messages
FOR SELECT
USING (auth.role() = 'authenticated');

-- Authenticated users can update (mark as read)
CREATE POLICY "Authenticated users can update messages"
ON public.contact_messages
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Authenticated users can delete messages
CREATE POLICY "Authenticated users can delete messages"
ON public.contact_messages
FOR DELETE
USING (auth.role() = 'authenticated');