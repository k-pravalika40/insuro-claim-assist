
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VerificationResult {
  claimId: string;
  status: string;
  fraudScore: number;
  settlementAmount: number;
  approved: boolean;
  reason: string;
}

export const useAIVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const verifyClaim = async (claimId: string): Promise<VerificationResult | null> => {
    setIsVerifying(true);
    
    try {
      console.log('Starting AI verification for claim:', claimId);

      const { data, error } = await supabase.functions.invoke('ai-verify-claim', {
        body: { claimId }
      });

      if (error) {
        console.error('AI verification error:', error);
        toast({
          title: "Verification Failed",
          description: "Failed to verify claim with AI. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      console.log('AI verification completed:', data);
      
      const result = data.result;
      
      toast({
        title: result.approved ? "Claim Approved!" : "Claim Rejected",
        description: result.approved 
          ? `Your claim has been approved. Settlement amount: $${result.settlementAmount}`
          : `Your claim has been rejected. Reason: ${result.reason}`,
        variant: result.approved ? "default" : "destructive",
      });

      return result;
    } catch (error) {
      console.error('AI verification error:', error);
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred during verification",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    verifyClaim,
    isVerifying
  };
};
