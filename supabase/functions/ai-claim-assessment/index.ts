
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ClaimAssessmentRequest {
  claimId: string;
  claimType: string;
  description: string;
  vehicleMake?: string;
  vehicleModel?: string;
  incidentLocation?: string;
  damageImageUrl?: string;
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

    const { claimId, claimType, description, vehicleMake, vehicleModel, incidentLocation }: ClaimAssessmentRequest = await req.json();

    console.log('Processing AI assessment for claim:', claimId);

    // AI-powered damage assessment logic
    const damageScore = calculateDamageScore(claimType, description);
    const fraudScore = calculateFraudScore(description, claimType, incidentLocation);
    const settlementAmount = calculateSettlementAmount(damageScore, claimType, vehicleMake, vehicleModel);

    // Update the claim with AI assessment results
    const { error: updateError } = await supabase
      .from('Claims')
      .update({
        damage_score: damageScore,
        fraud_score: fraudScore,
        settlement_amount: settlementAmount,
        status: fraudScore > 0.7 ? 'Under Review' : (damageScore > 0.8 ? 'Approved' : 'Pending Review'),
        updated_at: new Date().toISOString()
      })
      .eq('id', claimId);

    if (updateError) {
      console.error('Error updating claim:', updateError);
      throw updateError;
    }

    console.log('AI assessment completed for claim:', claimId, {
      damageScore,
      fraudScore,
      settlementAmount
    });

    return new Response(JSON.stringify({
      success: true,
      assessment: {
        damageScore,
        fraudScore,
        settlementAmount,
        recommendation: fraudScore > 0.7 ? 'Manual Review Required' : 
                      damageScore > 0.8 ? 'Approve' : 'Standard Review'
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in AI claim assessment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// AI-powered damage assessment
function calculateDamageScore(claimType: string, description: string): number {
  let score = 0.5; // Base score

  // Analyze claim type
  const severityKeywords = {
    high: ['total', 'severe', 'major', 'extensive', 'destroyed', 'collision', 'accident'],
    medium: ['moderate', 'significant', 'damage', 'dent', 'scratch', 'broken'],
    low: ['minor', 'small', 'light', 'superficial', 'cosmetic']
  };

  const lowerDescription = description.toLowerCase();
  
  if (severityKeywords.high.some(keyword => lowerDescription.includes(keyword))) {
    score += 0.3;
  } else if (severityKeywords.medium.some(keyword => lowerDescription.includes(keyword))) {
    score += 0.2;
  } else if (severityKeywords.low.some(keyword => lowerDescription.includes(keyword))) {
    score += 0.1;
  }

  // Claim type modifiers
  if (claimType === 'Collision') score += 0.2;
  else if (claimType === 'Comprehensive') score += 0.15;
  else if (claimType === 'Liability') score += 0.1;

  return Math.min(Math.max(score, 0), 1);
}

// AI-powered fraud detection
function calculateFraudScore(description: string, claimType: string, location?: string): number {
  let fraudScore = 0;

  // Red flag keywords
  const fraudKeywords = [
    'stolen', 'theft', 'missing', 'vandalism', 'mysterious', 'unknown',
    'suddenly', 'overnight', 'disappeared', 'cannot find'
  ];

  const lowerDescription = description.toLowerCase();
  fraudKeywords.forEach(keyword => {
    if (lowerDescription.includes(keyword)) {
      fraudScore += 0.2;
    }
  });

  // Inconsistency patterns
  if (description.length < 20) fraudScore += 0.1; // Too brief
  if (description.length > 1000) fraudScore += 0.1; // Suspiciously detailed

  // Location-based analysis
  if (location && (
    location.toLowerCase().includes('parking lot') || 
    location.toLowerCase().includes('private property')
  )) {
    fraudScore += 0.1;
  }

  return Math.min(Math.max(fraudScore, 0), 1);
}

// Settlement amount calculation
function calculateSettlementAmount(damageScore: number, claimType: string, vehicleMake?: string, vehicleModel?: string): number {
  let baseAmount = 1000; // Minimum settlement

  // Damage-based calculation
  if (damageScore > 0.8) baseAmount = 8000;
  else if (damageScore > 0.6) baseAmount = 5000;
  else if (damageScore > 0.4) baseAmount = 3000;
  else baseAmount = 1500;

  // Claim type modifiers
  const typeMultipliers = {
    'Collision': 1.2,
    'Comprehensive': 1.0,
    'Liability': 0.8,
    'Uninsured Motorist': 1.1
  };

  baseAmount *= typeMultipliers[claimType as keyof typeof typeMultipliers] || 1.0;

  // Vehicle value estimation (simplified)
  const luxuryBrands = ['BMW', 'Mercedes', 'Audi', 'Lexus', 'Porsche'];
  if (vehicleMake && luxuryBrands.includes(vehicleMake.toUpperCase())) {
    baseAmount *= 1.3;
  }

  return Math.round(baseAmount);
}

serve(handler);
