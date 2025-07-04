
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckSquare, Download } from "lucide-react";

interface BulkActionsProps {
  claims: any[];
  onUpdate: () => void;
}

const BulkActions = ({ claims, onUpdate }: BulkActionsProps) => {
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClaims(claims.map(c => c.id));
    } else {
      setSelectedClaims([]);
    }
  };

  const handleSelectClaim = (claimId: string, checked: boolean) => {
    if (checked) {
      setSelectedClaims([...selectedClaims, claimId]);
    } else {
      setSelectedClaims(selectedClaims.filter(id => id !== claimId));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedClaims.length === 0) {
      toast({
        title: "Invalid Selection",
        description: "Please select claims and an action",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('claims')
        .update({ status: bulkAction })
        .in('id', selectedClaims);

      if (error) throw error;

      toast({
        title: "Bulk Action Completed",
        description: `${selectedClaims.length} claims updated to ${bulkAction}`,
      });

      setSelectedClaims([]);
      setBulkAction("");
      onUpdate();
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: "Bulk Action Failed",
        description: "Failed to update claims",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToCSV = () => {
    const csvData = claims.map(claim => ({
      ID: claim.id,
      Type: claim.claim_type,
      Status: claim.status,
      'Created Date': new Date(claim.created_at).toLocaleDateString(),
      'Vehicle Number': claim.vehicle_number,
      Description: claim.description
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claims_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckSquare className="h-5 w-5 mr-2" />
          Bulk Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedClaims.length === claims.length && claims.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm">
              Select All ({selectedClaims.length} selected)
            </label>
          </div>

          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Approved">Approve</SelectItem>
              <SelectItem value="Rejected">Reject</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleBulkAction}
            disabled={isProcessing || selectedClaims.length === 0 || !bulkAction}
          >
            {isProcessing ? "Processing..." : "Apply Action"}
          </Button>

          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Individual claim selection */}
        <div className="mt-4 max-h-60 overflow-y-auto">
          {claims.map((claim) => (
            <div key={claim.id} className="flex items-center space-x-2 py-1">
              <Checkbox
                id={claim.id}
                checked={selectedClaims.includes(claim.id)}
                onCheckedChange={(checked) => handleSelectClaim(claim.id, checked as boolean)}
              />
              <label htmlFor={claim.id} className="text-sm truncate">
                {claim.id.substring(0, 8)}... - {claim.claim_type} - {claim.status}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkActions;
