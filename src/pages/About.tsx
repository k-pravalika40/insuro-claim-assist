
import { Shield, Brain, FileCheck, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/BackButton";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About InsuroAI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming the insurance industry through artificial intelligence and automation
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            InsuroAI was created to revolutionize the traditional insurance claim process, which has long been 
            plagued by inefficiencies, delays, and manual errors. Our AI-powered platform automates claim 
            registration, document verification, and damage assessment, reducing processing time from weeks to minutes.
          </p>
          <p className="text-lg text-gray-600">
            We believe that technology should make life easier, not more complicated. That's why we've designed 
            our system to be intuitive, transparent, and incredibly fast, giving both insurers and policyholders 
            the peace of mind they deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced machine learning algorithms analyze claims with unprecedented accuracy and speed.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Automated Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Documents are instantly verified and processed using intelligent document recognition technology.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Damage Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Computer vision technology accurately assesses vehicle damage from uploaded photographs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle>Fraud Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sophisticated algorithms detect and prevent fraudulent claims, protecting all stakeholders.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Technology Behind InsuroAI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Machine Learning</h3>
              <p className="text-gray-600 mb-6">
                Our platform uses advanced machine learning models trained on millions of insurance claims 
                to provide accurate damage assessments and fraud detection.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Computer Vision</h3>
              <p className="text-gray-600">
                State-of-the-art computer vision algorithms analyze vehicle damage from photographs, 
                providing detailed reports in seconds.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Natural Language Processing</h3>
              <p className="text-gray-600 mb-6">
                Our NLP technology extracts and understands key information from claim descriptions 
                and supporting documents automatically.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Blockchain Security</h3>
              <p className="text-gray-600">
                All claim data is secured using blockchain technology, ensuring transparency, 
                immutability, and trust in the claim process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
