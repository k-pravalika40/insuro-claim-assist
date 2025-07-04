
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Calendar, MapPin, Car, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Claim } from "@/hooks/useClaims";
import ClaimTimeline from "@/components/ClaimTimeline";
import ImageViewer from "@/components/ImageViewer";

interface ClaimFile {
  id: string;
  file_url: string;
  file_type: string | null;
  uploaded_at: string | null;
}

const ClaimDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [files, setFiles] = useState<ClaimFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !id) return;

    const fetchClaimDetails = async () => {
      try {
        // Fetch claim details
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (claimError) throw claimError;
        setClaim(claimData);

        // Fetch associated files
        const { data: filesData, error: filesError } = await supabase
          .from('files')
          .select('*')
          .eq('claim_id', id);

        if (filesError) throw filesError;
        setFiles(filesData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch claim details');
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetails();
  }, [user, id]);

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Mock timeline data - in real app, this would come from database
  const timelineEvents = claim ? [
    {
      id: '1',
      status: 'Submitted',
      timestamp: claim.created_at || new Date().toISOString(),
      description: 'Claim submitted and received'
    },
    {
      id: '2',
      status: 'Under Review',
      timestamp: claim.created_at || new Date().toISOString(),
      description: 'AI processing completed, manual review in progress'
    },
    ...(claim.status === 'Approved' || claim.status === 'Rejected' ? [{
      id: '3',
      status: claim.status,
      timestamp: claim.created_at || new Date().toISOString(),
      description: `Claim ${claim.status.toLowerCase()}`
    }] : [])
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Claim not found'}</p>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Claim Details</h1>
            <Badge className={getStatusColor(claim.status)}>
              {claim.status || 'Unknown'}
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">Claim ID: {claim.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Claim Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Claim Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Claim Type</label>
                  <p className="text-gray-900">{claim.claim_type || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{claim.description || 'No description provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vehicle Number</label>
                  <p className="text-gray-900">{claim.vehicle_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Incident Date</label>
                  <p className="text-gray-900">{formatDate(claim.incident_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted On</label>
                  <p className="text-gray-900">{formatDate(claim.created_at)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>
                  Files and images submitted with this claim
                </CardDescription>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No documents uploaded</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map((file) => (
                      <ImageViewer
                        key={file.id}
                        imageUrl={file.file_url}
                        fileName={file.file_url.split('/').pop() || 'Document'}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ClaimTimeline events={timelineEvents} currentStatus={claim.status || 'Unknown'} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetails;
