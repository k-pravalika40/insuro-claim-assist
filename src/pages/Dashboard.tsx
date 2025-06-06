
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Plus, FileText, Clock, CheckCircle, AlertTriangle, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data for demonstration
  const recentClaims = [
    { id: "CLM-001", type: "Vehicle Damage", status: "Under Review", date: "2024-01-15", amount: "$2,500" },
    { id: "CLM-002", type: "Theft", status: "Approved", date: "2024-01-10", amount: "$8,900" },
    { id: "CLM-003", type: "Collision", status: "Processing", date: "2024-01-05", amount: "$4,200" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Under Review":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "Processing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, John Doe</span>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your insurance claims and track their progress</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Plus className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Submit New Claim</CardTitle>
              <CardDescription>
                Start a new insurance claim with our AI-powered system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/submit-claim">
                <Button className="w-full">Submit Claim</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>View All Claims</CardTitle>
              <CardDescription>
                Browse and manage all your submitted claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/claims">
                <Button variant="outline" className="w-full">View Claims</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle>Policy Information</CardTitle>
              <CardDescription>
                View your policy details and coverage information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Policy</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Claims */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
            <CardDescription>
              Your latest insurance claim submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(claim.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{claim.id}</h3>
                      <p className="text-sm text-gray-600">{claim.type}</p>
                      <p className="text-xs text-gray-500">Submitted on {claim.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">{claim.amount}</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
