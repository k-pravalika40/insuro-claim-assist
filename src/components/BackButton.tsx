
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="mb-4 text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
};

export default BackButton;
