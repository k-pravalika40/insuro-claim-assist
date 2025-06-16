
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ClaimFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  isSubmitting?: boolean;
}

const ClaimFormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevStep, 
  onNextStep, 
  isSubmitting = false 
}: ClaimFormNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 1}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      {currentStep === totalSteps ? (
        <Button 
          type="submit" 
          className="bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Claim"}
        </Button>
      ) : (
        <Button type="button" onClick={onNextStep}>
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default ClaimFormNavigation;
