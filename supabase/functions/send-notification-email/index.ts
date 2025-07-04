
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  type: 'claim_status_update' | 'claim_submitted' | 'welcome';
  data: {
    userName?: string;
    claimId?: string;
    status?: string;
    claimType?: string;
  };
}

const getEmailTemplate = (type: string, data: any) => {
  switch (type) {
    case 'claim_status_update':
      return {
        subject: `Claim ${data.status}: ${data.claimId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">InsuroAI</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <h2 style="color: #1e40af;">Claim Status Update</h2>
              <p>Hello ${data.userName || 'Valued Customer'},</p>
              <p>Your insurance claim has been <strong>${data.status.toLowerCase()}</strong>.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Claim ID:</strong> ${data.claimId}</p>
                <p><strong>Status:</strong> <span style="color: ${data.status === 'Approved' ? '#16a34a' : '#dc2626'};">${data.status}</span></p>
                <p><strong>Type:</strong> ${data.claimType || 'N/A'}</p>
              </div>
              ${data.status === 'Approved' 
                ? '<p style="color: #16a34a;">Congratulations! Your claim has been approved. You will receive further instructions on the settlement process soon.</p>'
                : '<p style="color: #dc2626;">We regret to inform you that your claim has been rejected. If you believe this is an error, please contact our support team.</p>'
              }
              <p>Best regards,<br>The InsuroAI Team</p>
            </div>
          </div>
        `
      };
    
    case 'claim_submitted':
      return {
        subject: `Claim Submitted Successfully - ${data.claimId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">InsuroAI</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <h2 style="color: #1e40af;">Claim Submitted Successfully</h2>
              <p>Hello ${data.userName || 'Valued Customer'},</p>
              <p>Thank you for submitting your insurance claim. We have received your claim and it is now being processed.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Claim ID:</strong> ${data.claimId}</p>
                <p><strong>Type:</strong> ${data.claimType || 'N/A'}</p>
                <p><strong>Status:</strong> <span style="color: #f59e0b;">Pending Review</span></p>
              </div>
              <p>Our team will review your claim and get back to you within 3-5 business days. You can track the status of your claim in your dashboard.</p>
              <p>Best regards,<br>The InsuroAI Team</p>
            </div>
          </div>
        `
      };

    case 'welcome':
      return {
        subject: 'Welcome to InsuroAI!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">InsuroAI</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <h2 style="color: #1e40af;">Welcome to InsuroAI!</h2>
              <p>Hello ${data.userName || 'Valued Customer'},</p>
              <p>Thank you for joining InsuroAI! We're excited to help you manage your insurance claims efficiently with our AI-powered platform.</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">What you can do:</h3>
                <ul style="color: #374151;">
                  <li>Submit new insurance claims quickly and easily</li>
                  <li>Track the status of your claims in real-time</li>
                  <li>Upload supporting documents and photos</li>
                  <li>Receive instant AI-powered claim assessments</li>
                </ul>
              </div>
              <p>Ready to get started? Log in to your dashboard and submit your first claim!</p>
              <p>Best regards,<br>The InsuroAI Team</p>
            </div>
          </div>
        `
      };

    default:
      return {
        subject: 'Notification from InsuroAI',
        html: '<p>You have a new notification from InsuroAI.</p>'
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, data }: EmailRequest = await req.json();

    const template = getEmailTemplate(type, data);

    const emailResponse = await resend.emails.send({
      from: "InsuroAI <onboarding@resend.dev>",
      to: [to],
      subject: template.subject,
      html: template.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
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
