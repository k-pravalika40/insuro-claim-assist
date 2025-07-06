
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useClaims } from "@/hooks/useClaims";
import { useAIVerification } from "@/hooks/useAIVerification";
import LoadingSpinner from "./LoadingSpinner";

interface ClaimsTableProps {
  showVerifyButton?: boolean;
}

const ClaimsTable = ({ showVerifyButton = false }: ClaimsTableProps) => {
  const { claims, loading, error, refetch } = useClaims();
  const { verifyClaim, isVerifying } = useAIVerification();
  const [verifyingClaimId, setVerifyingClaimId] = useState<string | null>(null);

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleVerify = async (claimId: string) => {
    setVerifyingClaimId(claimId);
    const result = await verifyClaim(claimId);
    if (result) {
      // Refresh claims list to show updated status
      refetch();
    }
    setVerifyingClaimId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Claims</CardTitle>
          <CardDescription>Review and track your insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Claims</CardTitle>
          <CardDescription>Review and track your insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading claims: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Claims</CardTitle>
        <CardDescription>Review and track your insurance claims</CardDescription>
      </CardHeader>
      <CardContent>
        {claims.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No claims found</p>
            <Link to="/submit-claim">
              <Button>Submit Your First Claim</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Claim ID</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-mono text-sm">
                        {claim.id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="p-4">{claim.claim_type || 'N/A'}</td>
                    <td className="p-4">{formatDate(claim.created_at)}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Link to={`/claim/${claim.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        {showVerifyButton && claim.status === 'Pending' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleVerify(claim.id)}
                            disabled={isVerifying || verifyingClaimId === claim.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {verifyingClaimId === claim.id ? 'Verifying...' : 'Verify'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimsTable;
