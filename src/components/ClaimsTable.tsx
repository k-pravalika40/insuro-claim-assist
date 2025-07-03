
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileText } from "lucide-react";
import { useClaims } from "@/hooks/useClaims";

const ClaimsTable = () => {
  const { claims, loading, error } = useClaims();

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Your Claims
          </CardTitle>
          <CardDescription>Track the status of your insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading claims...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Your Claims
          </CardTitle>
          <CardDescription>Track the status of your insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading claims: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Your Claims
        </CardTitle>
        <CardDescription>Track the status of your insurance claims</CardDescription>
      </CardHeader>
      <CardContent>
        {claims.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No claims submitted yet</p>
            <Link to="/submit-claim">
              <Button>Submit Your First Claim</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Incident Date</TableHead>
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
                      <Link to={`/claim/${claim.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimsTable;
