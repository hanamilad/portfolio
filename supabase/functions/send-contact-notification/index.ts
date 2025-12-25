import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactMessageRequest = await req.json();

    // Validate input
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save message to database
    const { data: savedMessage, error: dbError } = await supabase
      .from("contact_messages")
      .insert({ name, email, message })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save message" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Message saved to database:", savedMessage.id);

    // Get admin email from contact_info or about_content
    const { data: contactInfo } = await supabase
      .from("contact_info")
      .select("email")
      .limit(1)
      .maybeSingle();

    const { data: aboutContent } = await supabase
      .from("about_content")
      .select("email")
      .limit(1)
      .maybeSingle();

    const adminEmail = contactInfo?.email || aboutContent?.email;

    if (adminEmail) {
      // Send notification email to admin
      const emailResponse = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New Contact Message from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This message was sent from your portfolio contact form.</p>
        `,
      });

      console.log("Email notification sent:", emailResponse);
    } else {
      console.log("No admin email configured, skipping notification");
    }

    return new Response(
      JSON.stringify({ success: true, messageId: savedMessage.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
