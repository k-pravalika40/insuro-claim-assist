
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyClaimRequest {
  claimId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { claimId }: VerifyClaimRequest = await req.json();

    console.log('Starting AI verification for claim:', claimId);

    // Get claim details
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single();

    if (claimError || !claim) {
      throw new Error('Claim not found');
    }

    // Get uploaded files for the claim
    const { data: files } = await supabase
      .from('files')
      .select('*')
      .eq('claim_id', claimId);

    // AI fraud detection logic
    const fraudScore = calculateFraudScore(claim, files || []);
    const isApproved = fraudScore < 0.5; // Threshold for approval
    const settlementAmount = isApproved ? calculateSettlement(claim) : 0;

    // Update claim status
    const newStatus = isApproved ? 'Approved' : 'Rejected';
    
    const { error: updateError } = await supabase
      .from('claims')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', claimId);

    if (updateError) {
      throw updateError;
    }

    console.log('AI verification completed for claim:', claimId, {
      fraudScore,
      isApproved,
      settlementAmount
    });

    return new Response(JSON.stringify({
      success: true,
      result: {
        claimId,
        status: newStatus,
        fraudScore,
        settlementAmount,
        approved: isApproved,
        reason: isApproved ? 'No fraud detected' : 'Potential fraud detected'
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in AI verification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );  }
};

// AI fraud detection algorithm
function calculateFraudScore(claim: any, files: any[]): number {
  let fraudScore = 0;

  // Check description for suspicious patterns
  const description = (claim.description || '').toLowerCase();
  const suspiciousKeywords = ['stolen', 'theft', 'missing', 'vandalism', 'mysterious', 'unknown', 'suddenly'];
  
  suspiciousKeywords.forEach(keyword => {
    if (description.includes(keyword)) {
      fraudScore += 0.2;
    }
  });

  // Check if description is too brief or too detailed
  if (description.length < 20) fraudScore += 0.3;
  if (description.length > 1000) fraudScore += 0.2;

  // Check for missing documentation
  if (files.length === 0) fraudScore += 0.3;

  // Check timing - claims submitted very late at night might be suspicious
  if (claim.created_at) {
    const submitHour = new Date(claim.created_at).getHours();
    if (submitHour >= 23 || submitHour <= 5) {
      fraudScore += 0.1;
    }
  }

  // Check delay between incident and submission
  if (claim.incident_date && claim.created_at) {
    const incidentDate = new Date(claim.incident_date);
    const submissionDate = new Date(claim.created_at);
    const daysDifference = Math.abs((submissionDate.getTime() - incidentDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDifference > 30) {
      fraudScore += 0.2;
    }
  }

  return Math.min(fraudScore, 1);
}

// Calculate settlement amount
function calculateSettlement(claim: any): number {
  let baseAmount = 1000;

  // Adjust based on claim type
  switch (claim.claim_type) {
    case 'Collision':
      baseAmount = 5000;
      break;
    case 'Comprehensive':
      baseAmount = 3000;
      break;
    case 'Liability':
      baseAmount = 2000;
      break;
    case 'Uninsured Motorist':
      baseAmount = 4000;
      break;
    default:
      baseAmount = 1500;
  }

  // Add some randomization for realism
  const variation = Math.random() * 0.4 + 0.8; // 80% to 120%
  return Math.round(baseAmount * variation);
}

serve(handler);
