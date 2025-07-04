
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

    setIsSubmitting(true);

    try {
      let uploadedFileUrl = null;
      if (selectedFile) {
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
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('claim-documents')
          .getPublicUrl(uploadData.path);
        
        uploadedFileUrl = publicUrl;
      }

      // Submit claim to database - using the 'claims' table (lowercase)
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .insert({
          user_id: user.id,
          claim_type: formData.claimType,
          description: formData.description,
          incident_date: formData.incidentDate.toISOString().split('T')[0],
          damage_image_url: uploadedFileUrl,
          status: 'Pending'
        })
        .select()
        .single();

      if (claimError) throw claimError;

      const claimId = claimData.id;

      if (uploadedFileUrl) {
        const { error: fileAssociationError } = await supabase
          .from('files')
          .insert({
            claim_id: claimId,
            file_url: uploadedFileUrl,
            user_id: user.id,
          });

        if (fileAssociationError) {
          console.error("File association error:", fileAssociationError);
          toast({
            title: "File Association Error",
            description: "Failed to associate the uploaded file with the claim.",
            variant: "destructive",
          });
        }
      }

      // Send claim submitted email
      await sendClaimSubmitted(
        user.email || '',
        claimId.toString(),
        formData.claimType,
        user.user_metadata?.first_name
      );

      // Trigger AI assessment
      setTimeout(async () => {
        await processClaimWithAI({
          claimId: claimId.toString(),
          claimType: formData.claimType,
          description: formData.description,
          vehicleMake: formData.vehicleMake,
          vehicleModel: formData.vehicleModel,
          incidentLocation: formData.incidentLocation,
          damageImageUrl: uploadedFileUrl
        });
      }, 2000);

      toast({
        title: "Claim Submitted Successfully!",
        description: `Your claim #${claimId} has been submitted and is being processed by our AI system.`,
      });

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
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Claim submission error:", error);
      toast({
        title: "Claim Submission Failed",
        description: error.message || "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                <Label htmlFor="claimType">Claim Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, claimType: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select claim type" defaultValue={formData.claimType} />
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
                <Label htmlFor="description">Description of Incident</Label>
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
                  required
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
                  required
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
                <Label htmlFor="policyNumber">Policy Number</Label>
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
                <Label htmlFor="fileUpload">Upload Document</Label>
                <Input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  onChange={handleFileSelect}
                />
                {selectedFile && (
                  <div className="mt-2">
                    <p>Selected File: {selectedFile.name}</p>
                  </div>
                )}
                {isUploading ? (
                  <p>Uploading...</p>
                ) : (
                  uploadedFileUrl ? (
                    <p>File uploaded successfully!</p>
                  ) : null
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Claim"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitClaim;
