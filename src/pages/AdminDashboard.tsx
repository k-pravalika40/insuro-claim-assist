
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, ArrowLeft, Users, FileText, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Claim } from "@/hooks/useClaims";

interface AdminStats {
  total_claims: number;
  pending_claims: number;
  approved_claims: number;
  rejected_claims: number;
  avg_processing_days: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (claimsError) throw claimsError;

      // Fetch admin stats
      const { data: statsData, error: statsError } = await supabase
        .from('admin_claim_stats')
        .select('*')
        .single();

      if (statsError) throw statsError;

      setClaims(claimsData || []);
      setStats(statsData);
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
      const { error } = await supabase
        .from('claims')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Claim status updated to ${newStatus}`,
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error updating claim status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update claim status",
        variant: "destructive",
      });
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
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateClaimStatus(claim.id, 'Rejected')}
                                >
                                  Reject
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
    </div>
  );
};

export default AdminDashboard;
