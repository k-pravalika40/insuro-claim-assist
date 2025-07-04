
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAIClaimAssessment = () => {
  const { toast } = useToast();

  const processClaimWithAI = async (claimData: {
    claimId: string;
    claimType: string;
    description: string;
    vehicleMake?: string;
    vehicleModel?: string;
    incidentLocation?: string;
    damageImageUrl?: string;
  }) => {
    try {
      console.log('Starting AI assessment for claim:', claimData.claimId);

      const { data, error } = await supabase.functions.invoke('ai-claim-assessment', {
        body: claimData
      });

      if (error) {
        console.error('AI assessment error:', error);
        toast({
          title: "AI Assessment Error",
          description: "Failed to process claim with AI. Manual review required.",
          variant: "destructive",
        });
        return null;
      }

      console.log('AI assessment completed:', data);
      
      toast({
        title: "AI Assessment Complete",
        description: `Claim processed with ${data.assessment.recommendation}`,
        variant: "default",
      });

      return data.assessment;
    } catch (error) {
      console.error('AI assessment error:', error);
      toast({
        title: "AI Assessment Error",
        description: "An unexpected error occurred during AI processing",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    processClaimWithAI
  };
};
