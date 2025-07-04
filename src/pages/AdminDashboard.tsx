import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ArrowLeft, Users, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEmailNotifications } from "@/hooks/useEmailNotifications";
import { Claim } from "@/hooks/useClaims";
import AdminAnalytics from "@/components/AdminAnalytics";
import BulkActions from "@/components/BulkActions";

interface AdminStats {
  total_claims: number;
  pending_claims: number;
  approved_claims: number;
  rejected_claims: number;
  avg_processing_days: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const { sendClaimStatusUpdate } = useEmailNotifications();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingClaim, setUpdatingClaim] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const calculateStats = (claimsData: Claim[]): AdminStats => {
    const total = claimsData.length;
    const pending = claimsData.filter(c => c.status === 'Pending').length;
    const approved = claimsData.filter(c => c.status === 'Approved').length;
    const rejected = claimsData.filter(c => c.status === 'Rejected').length;
    
    // Calculate average processing days for approved claims
    const approvedClaims = claimsData.filter(c => c.status === 'Approved');
    let avgDays = 0;
    if (approvedClaims.length > 0) {
      const totalDays = approvedClaims.reduce((sum, claim) => {
        if (claim.created_at) {
          const created = new Date(claim.created_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - created.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }
        return sum;
      }, 0);
      avgDays = totalDays / approvedClaims.length;
    }

    return {
      total_claims: total,
      pending_claims: pending,
      approved_claims: approved,
      rejected_claims: rejected,
      avg_processing_days: avgDays
    };
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (claimsError) throw claimsError;

      const claimsArray = claimsData || [];
      setClaims(claimsArray);
      
      // Calculate stats from claims data
      const calculatedStats = calculateStats(claimsArray);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (claimId: string, newStatus: string) => {
    try {
      setUpdatingClaim(claimId);
      
      // First, get the claim details including user email
      const { data: claimData, error: claimError } = await supabase
        .from('claims')
        .select('*, user_id')
        .eq('id', claimId)
        .single();

      if (claimError) throw claimError;

      // Get user email from auth.users
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(claimData.user_id);
      
      if (userError) {
        console.warn('Could not fetch user data for email notification:', userError);
      }

      // Update claim status
      const { error } = await supabase
        .from('claims')
        .update({ status: newStatus })
        .eq('id', claimId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Claim status updated to ${newStatus}`,
      });

      // Send email notification if we have user email
      if (userData?.user?.email) {
        const userName = userData.user.user_metadata?.first_name || 
                        userData.user.user_metadata?.full_name || 
                        userData.user.email.split('@')[0];
        
        await sendClaimStatusUpdate(
          userData.user.email,
          claimId,
          newStatus,
          claimData.claim_type,
          userName
        );
      }

      fetchAdminData();
    } catch (error) {
      console.error('Error updating claim status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update claim status",
        variant: "destructive",
      });
    } finally {
      setUpdatingClaim(null);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
              <span className="text-xl font-bold text-gray-900">InsuroAI Admin</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage claims and monitor system performance</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="claims" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Claims Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total_claims}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending_claims}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.approved_claims}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(stats.avg_processing_days || 0)} days</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Claims */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Claims</CardTitle>
                <CardDescription>Latest submitted claims requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Claim ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {claims.slice(0, 5).map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell className="font-mono text-sm">
                            {claim.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{claim.claim_type || 'N/A'}</TableCell>
                          <TableCell>{formatDate(claim.incident_date)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(claim.status)}>
                              {claim.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link to={`/claim/${claim.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics claims={claims} />
          </TabsContent>

          <TabsContent value="claims">
            <div className="space-y-6">
              <BulkActions claims={claims} onUpdate={fetchAdminData} />
              
              {/* Claims Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    All Claims
                  </CardTitle>
                  <CardDescription>Manage and process insurance claims</CardDescription>
                </CardHeader>
                <CardContent>
                  {claims.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No claims found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Claim ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {claims.map((claim) => (
                            <TableRow key={claim.id}>
                              <TableCell className="font-mono text-sm">
                                {claim.id.substring(0, 8)}...
                              </TableCell>
                              <TableCell>{claim.claim_type || 'N/A'}</TableCell>
                              <TableCell>{claim.vehicle_number || 'N/A'}</TableCell>
                              <TableCell>{formatDate(claim.incident_date)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(claim.status)}>
                                  {claim.status || 'Unknown'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Link to={`/claim/${claim.id}`}>
                                    <Button variant="outline" size="sm">
                                      View
                                    </Button>
                                  </Link>
                                  {claim.status === 'Pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => updateClaimStatus(claim.id, 'Approved')}
                                        disabled={updatingClaim === claim.id}
                                      >
                                        {updatingClaim === claim.id ? 'Updating...' : 'Approve'}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => updateClaimStatus(claim.id, 'Rejected')}
                                        disabled={updatingClaim === claim.id}
                                      >
                                        {updatingClaim === claim.id ? 'Updating...' : 'Reject'}
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
