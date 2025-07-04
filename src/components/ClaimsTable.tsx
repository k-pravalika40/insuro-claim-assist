
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useClaims } from "@/hooks/useClaims";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { SearchInput } from "@/components/SearchInput";
import { useDebounce } from "@/hooks/useDebounce";

const ClaimsTable = () => {
  const { claims, loading, error } = useClaims();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredClaims = claims.filter(claim => 
    claim.claim_type?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    claim.vehicle_number?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    claim.status?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

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
            My Claims
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
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
            My Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error loading claims: {error.message}</p>
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
          My Claims
        </CardTitle>
        <CardDescription>
          Track and manage your insurance claims
        </CardDescription>
        <div className="flex justify-between items-center mt-4">
          <SearchInput
            placeholder="Search claims..."
            onSearch={setSearchQuery}
            className="max-w-sm"
          />
          <Link to="/submit-claim">
            <Button className="inline-flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {claims.length === 0 ? (
          <EmptyState
            title="No claims found"
            description="You haven't submitted any insurance claims yet. Get started by submitting your first claim."
            actionLabel="Submit First Claim"
            onAction={() => window.location.href = '/submit-claim'}
            icon={<FileText className="h-12 w-12" />}
          />
        ) : filteredClaims.length === 0 ? (
          <EmptyState
            title="No matching claims"
            description="No claims match your search criteria. Try adjusting your search terms."
            icon={<FileText className="h-12 w-12" />}
          />
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
                {filteredClaims.map((claim) => (
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
                          View Details
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
