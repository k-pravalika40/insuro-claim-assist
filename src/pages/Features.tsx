
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scan, Shield, Clock, BarChart3, FileCheck, Camera, Brain, Zap } from "lucide-react";
import BackButton from "@/components/BackButton";

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Platform Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful AI-driven features that make InsuroAI the future of insurance claim processing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Scan className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Document Scanning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced OCR technology automatically extracts and validates information from insurance 
                documents, police reports, and medical records with 99.8% accuracy.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Fraud Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Machine learning algorithms analyze claim patterns, cross-reference databases, and 
                identify suspicious activities to prevent fraudulent claims before processing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Real-Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your claim status in real-time with detailed progress updates, estimated 
                completion times, and instant notifications at every stage.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>AI Photo Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Computer vision technology analyzes damage photos to assess severity, identify 
                affected parts, and estimate repair costs with professional-grade accuracy.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Automated Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instantly verify policy details, coverage limits, deductibles, and claim eligibility 
                through secure integrations with insurance databases.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Predictive Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Leverage historical data and machine learning to predict claim outcomes, optimize 
                settlements, and provide accurate timeline estimates.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advanced AI Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Language Processing</h3>
                <p className="text-gray-600">
                  Our NLP engine understands and extracts key information from claim descriptions, 
                  witness statements, and incident reports in multiple languages.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Processing</h3>
                <p className="text-gray-600">
                  Process complex claims in under 60 seconds using distributed computing and 
                  optimized machine learning algorithms for maximum efficiency.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Blockchain Security</h3>
                <p className="text-gray-600">
                  All claim data is secured using blockchain technology, ensuring immutable records, 
                  transparency, and protection against data tampering.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Continuous Learning</h3>
                <p className="text-gray-600">
                  Our AI models continuously learn from new claims data, improving accuracy and 
                  adapting to new fraud patterns and claim types automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Integration Capabilities</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">Insurance Management Systems</h3>
                <p className="text-gray-600 text-sm">Seamless integration with existing policy management and core insurance systems.</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">Payment Processors</h3>
                <p className="text-gray-600 text-sm">Direct integration with major payment gateways for instant settlement disbursement.</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">Third-Party APIs</h3>
                <p className="text-gray-600 text-sm">Connect with repair shops, medical providers, and other service networks.</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900">Regulatory Compliance</h3>
                <p className="text-gray-600 text-sm">Built-in compliance with insurance regulations across multiple jurisdictions.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.8%</div>
                <div className="text-gray-600">Document Accuracy</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">60s</div>
                <div className="text-gray-600">Average Processing</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
