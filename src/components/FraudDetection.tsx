
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, TrendingDown, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Claim } from "@/hooks/useClaims";
import { supabase } from "@/integrations/supabase/client";

interface FraudDetectionProps {
  claims: Claim[];
  onAnalysisComplete: () => void;
}

interface FraudAnalysis {
  claimId: string;
  fraudScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
}

const FraudDetection = ({ claims, onAnalysisComplete }: FraudDetectionProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<FraudAnalysis[]>([]);
  const { toast } = useToast();

  const analyzeFraud = (claim: Claim): FraudAnalysis => {
    let fraudScore = 0;
    const reasons: string[] = [];

    // Check description length (too short or too long might be suspicious)
    if (claim.description && claim.description.length < 20) {
      fraudScore += 0.3;
      reasons.push("Very brief description");
    } else if (claim.description && claim.description.length > 1000) {
      fraudScore += 0.2;
      reasons.push("Unusually detailed description");
    }

    // Check for suspicious keywords
    const suspiciousKeywords = ['stolen', 'theft', 'missing', 'vandalism', 'mysterious', 'unknown', 'suddenly', 'overnight'];
    const description = claim.description?.toLowerCase() || '';
    suspiciousKeywords.forEach(keyword => {
      if (description.includes(keyword)) {
        fraudScore += 0.15;
        reasons.push(`Contains suspicious keyword: "${keyword}"`);
      }
    });

    // Check claim timing (claims submitted very late at night might be suspicious)
    if (claim.created_at) {
      const submitHour = new Date(claim.created_at).getHours();
      if (submitHour >= 23 || submitHour <= 5) {
        fraudScore += 0.1;
        reasons.push("Submitted during unusual hours");
      }
    }

    // Check incident date vs submission date
    if (claim.incident_date && claim.created_at) {
      const incidentDate = new Date(claim.incident_date);
      const submissionDate = new Date(claim.created_at);
      const daysDifference = Math.abs((submissionDate.getTime() - incidentDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysDifference > 30) {
        fraudScore += 0.2;
        reasons.push("Long delay between incident and claim submission");
      }
    }

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    if (fraudScore >= 0.7) {
      riskLevel = 'HIGH';
    } else if (fraudScore >= 0.4) {
      riskLevel = 'MEDIUM';
    } else {
      riskLevel = 'LOW';
    }

    return {
      claimId: claim.id,
      fraudScore: Math.min(fraudScore, 1),
      riskLevel,
      reasons
    };
  };

  const runFraudAnalysis = async () => {
    setAnalyzing(true);
    try {
      const results = claims.map(claim => analyzeFraud(claim));
      setAnalysisResults(results);
      
      // Update claims with fraud scores in the database
      for (const result of results) {
        await supabase
          .from('claims')
          .update({ 
            status: result.riskLevel === 'HIGH' ? 'Under Review' : 
                   result.riskLevel === 'MEDIUM' ? 'Pending Review' : 'Pending'
          })
          .eq('id', result.claimId);
      }

      toast({
        title: "Fraud Analysis Complete",
        description: `Analyzed ${claims.length} claims for potential fraud indicators`,
      });

      onAnalysisComplete();
    } catch (error) {
      console.error('Fraud analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to complete fraud analysis",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4" />;
      case 'MEDIUM':
        return <TrendingUp className="h-4 w-4" />;
      case 'LOW':
        return <Shield className="h-4 w-4" />;
      default:
        return <TrendingDown className="h-4 w-4" />;
    }
  };

  const highRiskClaims = analysisResults.filter(r => r.riskLevel === 'HIGH').length;
  const mediumRiskClaims = analysisResults.filter(r => r.riskLevel === 'MEDIUM').length;
  const lowRiskClaims = analysisResults.filter(r => r.riskLevel === 'LOW').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            AI Fraud Detection
          </CardTitle>
          <CardDescription>
            Analyze claims for potential fraud indicators using AI-powered detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button 
              onClick={runFraudAnalysis} 
              disabled={analyzing || claims.length === 0}
              className="flex items-center"
            >
              {analyzing ? 'Analyzing...' : 'Run Fraud Analysis'}
            </Button>
            {analysisResults.length > 0 && (
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  High Risk: {highRiskClaims}
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Medium Risk: {mediumRiskClaims}
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Low Risk: {lowRiskClaims}
                </div>
              </div>
            )}
          </div>

          {analysisResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              {analysisResults.map((result) => {
                const claim = claims.find(c => c.id === result.claimId);
                return (
                  <div key={result.claimId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-mono text-sm">
                          Claim #{result.claimId.substring(0, 8)}...
                        </span>
                        <p className="text-sm text-gray-600">{claim?.claim_type}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getRiskColor(result.riskLevel)}>
                          {getRiskIcon(result.riskLevel)}
                          <span className="ml-1">{result.riskLevel} RISK</span>
                        </Badge>
                        <p className="text-sm mt-1">
                          Fraud Score: {(result.fraudScore * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    {result.reasons.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Risk Indicators:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {result.reasons.map((reason, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudDetection;
