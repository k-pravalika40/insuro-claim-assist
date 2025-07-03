import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PersonalInformationStep from "@/components/claim-form/PersonalInformationStep";
import VehicleInformationStep from "@/components/claim-form/VehicleInformationStep";
import IncidentDetailsStep from "@/components/claim-form/IncidentDetailsStep";
import DocumentUploadStep from "@/components/claim-form/DocumentUploadStep";
import ClaimFormProgress from "@/components/claim-form/ClaimFormProgress";
import ClaimFormNavigation from "@/components/claim-form/ClaimFormNavigation";

const SubmitClaim = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    policyNumber: "",
    
    // Vehicle Information
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleVin: "",
    vehiclePlate: "",
    
    // Incident Details
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    claimType: "",
    description: ""
  });

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToStorage = async (claimId: string) => {
    const uploadPromises = uploadedFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${claimId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('claim-images')
        .upload(fileName, file);

      if (error) throw error;

      // Save file reference to database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: user?.id,
          claim_id: claimId,
          file_url: data.path,
          file_type: file.type
        });

      if (dbError) throw dbError;
      
      return data.path;
    });

    return Promise.all(uploadPromises);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a claim.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create claim in database
      const { data: claim, error: claimError } = await supabase
        .from('claims')
        .insert({
          user_id: user.id,
          claim_type: formData.claimType,
          incident_date: formData.incidentDate,
          description: formData.description,
          vehicle_number: formData.vehiclePlate,
          status: 'Pending'
        })
        .select()
        .single();

      if (claimError) throw claimError;

      // Upload files if any
      if (uploadedFiles.length > 0) {
        await uploadFilesToStorage(claim.id);
      }

      toast({
        title: "Claim Submitted Successfully!",
        description: "Your claim has been submitted and is under review.",
      });

      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInformationStep 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
        );
      case 2:
        return (
          <VehicleInformationStep 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
        );
      case 3:
        return (
          <IncidentDetailsStep 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
        );
      case 4:
        return (
          <DocumentUploadStep 
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
          />
        );
      default:
        return null;
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Enter your personal information";
      case 2: return "Provide vehicle details";
      case 3: return "Describe the incident";
      case 4: return "Upload supporting documents";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">InsuroAI</span>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit New Claim</h1>
          <p className="text-gray-600">Fill out the form below to submit your insurance claim</p>
        </div>

        {/* Progress Bar */}
        <ClaimFormProgress currentStep={currentStep} totalSteps={totalSteps} />

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep} of {totalSteps}</CardTitle>
            <CardDescription>{getStepDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              <ClaimFormNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onPrevStep={prevStep}
                onNextStep={nextStep}
                isSubmitting={isSubmitting}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitClaim;
