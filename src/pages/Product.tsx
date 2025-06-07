
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileCheck, Shield, Zap, Camera, BarChart3 } from "lucide-react";
import BackButton from "@/components/BackButton";

const Product = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI-Driven Claim Automation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our intelligent automation workflow transforms the insurance claim process
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Automated Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Intake</h3>
              <p className="text-gray-600">
                AI extracts key information from claim submissions and automatically categorizes incidents.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Processing</h3>
              <p className="text-gray-600">
                Machine learning algorithms assess damage, verify documents, and detect potential fraud.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Decision</h3>
              <p className="text-gray-600">
                Get immediate claim decisions with detailed explanations and settlement recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Smart Document Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI reads and understands insurance documents, extracting relevant information 
                automatically without human intervention.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Photo Damage Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced computer vision analyzes vehicle damage photos to provide accurate 
                repair cost estimates and damage severity ratings.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Fraud Detection Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sophisticated algorithms analyze patterns and anomalies to identify potentially 
                fraudulent claims before they're processed.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Lightning-Fast Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Process claims in minutes instead of weeks, with real-time status updates 
                and instant notifications for all parties.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Automated Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Verify policy details, coverage limits, and claim eligibility automatically 
                using integrated insurance database connections.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Predictive Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Leverage historical data and machine learning to predict claim outcomes 
                and optimize settlement amounts for fair resolutions.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits for All Stakeholders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Policyholders</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Instant claim submission and processing</li>
                <li>• Real-time status tracking</li>
                <li>• Faster settlement payments</li>
                <li>• 24/7 availability</li>
                <li>• Transparent process with clear explanations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Insurance Companies</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Reduced operational costs</li>
                <li>• Improved fraud detection</li>
                <li>• Enhanced customer satisfaction</li>
                <li>• Streamlined workflows</li>
                <li>• Data-driven insights and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
