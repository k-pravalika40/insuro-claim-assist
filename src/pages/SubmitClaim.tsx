
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import { useAIClaimAssessment } from '@/hooks/useAIClaimAssessment';

const SubmitClaim = () => {
  const [formData, setFormData] = useState({
    claimType: "",
    description: "",
    incidentDate: new Date(),
    incidentTime: "09:00",
    incidentLocation: "",
    vehicleMake: "",
    vehicleModel: "",
    policyNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sendClaimSubmitted } = useEmailNotifications();
  const { processClaimWithAI } = useAIClaimAssessment();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a claim.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        incidentDate: date,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
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

    // Validate required fields
    if (!formData.claimType || !formData.description || !formData.policyNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting claim submission for user:', user.id);
      
      let uploadedFileUrl = null;
      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);
        setIsUploading(true);
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `claims/${user?.id}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('claim-documents')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });

        setIsUploading(false);

        if (uploadError) {
          console.error('File upload error:', uploadError);
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('claim-documents')
          .getPublicUrl(uploadData.path);
        
        uploadedFileUrl = publicUrl;
        console.log('File uploaded successfully:', uploadedFileUrl);
      }

      // Prepare claim data
      const claimData = {
        user_id: user.id,
        claim_type: formData.claimType,
        description: formData.description,
        incident_date: formData.incidentDate.toISOString().split('T')[0],
        damage_image_url: uploadedFileUrl,
        status: 'Pending'
      };

      console.log('Submitting claim data:', claimData);

      // Submit claim to database
      const { data: claimRecord, error: claimError } = await supabase
        .from('claims')
        .insert(claimData)
        .select()
        .single();

      if (claimError) {
        console.error('Claim submission error:', claimError);
        throw new Error(`Failed to submit claim: ${claimError.message}`);
      }

      console.log('Claim submitted successfully:', claimRecord);
      const claimId = claimRecord.id;

      // Associate file with claim
      if (uploadedFileUrl) {
        console.log('Associating file with claim:', claimId);
        const { error: fileAssociationError } = await supabase
          .from('files')
          .insert({
            claim_id: claimId,
            file_url: uploadedFileUrl,
            user_id: user.id,
          });

        if (fileAssociationError) {
          console.error("File association error:", fileAssociationError);
          // Don't fail the entire claim submission for file association errors
          toast({
            title: "Warning",
            description: "Claim submitted but file association failed.",
            variant: "default",
          });
        }
      }

      // Send notification email
      try {
        await sendClaimSubmitted(
          user.email || '',
          claimId.toString(),
          formData.claimType,
          user.user_metadata?.first_name || 'User'
        );
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail claim submission for email errors
      }

      // Trigger AI assessment
      setTimeout(async () => {
        try {
          await processClaimWithAI({
            claimId: claimId.toString(),
            claimType: formData.claimType,
            description: formData.description,
            vehicleMake: formData.vehicleMake,
            vehicleModel: formData.vehicleModel,
            incidentLocation: formData.incidentLocation,
            damageImageUrl: uploadedFileUrl
          });
        } catch (aiError) {
          console.error('AI assessment error:', aiError);
          // AI assessment failure shouldn't affect claim submission
        }
      }, 2000);

      toast({
        title: "Claim Submitted Successfully!",
        description: `Your claim #${claimId} has been submitted and is being processed.`,
      });

      // Reset form
      setFormData({
        claimType: "",
        description: "",
        incidentDate: new Date(),
        incidentTime: "09:00",
        incidentLocation: "",
        vehicleMake: "",
        vehicleModel: "",
        policyNumber: "",
      });
      setSelectedFile(null);
      setUploadedFileUrl(null);
      
      // Navigate to dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Claim submission error:", error);
      toast({
        title: "Claim Submission Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <Card className="shadow-xl sm:rounded-2xl overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold">Submit a Claim</CardTitle>
            <CardDescription>
              File your insurance claim quickly and easily.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="claimType">Claim Type *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, claimType: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Collision">Collision</SelectItem>
                    <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Uninsured Motorist">Uninsured Motorist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description of Incident *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what happened"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label>Incident Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.incidentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.incidentDate ? (
                        format(formData.incidentDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={formData.incidentDate}
                      onSelect={handleDateChange}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="incidentTime">Incident Time</Label>
                <Input
                  type="time"
                  id="incidentTime"
                  name="incidentTime"
                  value={formData.incidentTime}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="incidentLocation">Incident Location</Label>
                <Input
                  type="text"
                  id="incidentLocation"
                  name="incidentLocation"
                  placeholder="Where did the incident occur?"
                  value={formData.incidentLocation}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="vehicleMake">Vehicle Make</Label>
                <Input
                  type="text"
                  id="vehicleMake"
                  name="vehicleMake"
                  placeholder="e.g., Toyota"
                  value={formData.vehicleMake}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  type="text"
                  id="vehicleModel"
                  name="vehicleModel"
                  placeholder="e.g., Camry"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="policyNumber">Policy Number *</Label>
                <Input
                  type="text"
                  id="policyNumber"
                  name="policyNumber"
                  placeholder="Enter your policy number"
                  value={formData.policyNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="fileUpload">Upload Document (Optional)</Label>
                <Input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  onChange={handleFileSelect}
                  accept="image/*,.pdf"
                />
                {selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected File: {selectedFile.name}</p>
                  </div>
                )}
                {isUploading && (
                  <p className="text-sm text-blue-600 mt-2">Uploading file...</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? "Submitting Claim..." : "Submit Claim"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitClaim;
