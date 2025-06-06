
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Eye, Shield, Users } from "lucide-react";

const Features = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose InsuroAI?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our cutting-edge AI technology revolutionizes the insurance claim process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Instant Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Claims processed in minutes, not days. Our AI analyzes damage instantly upon submission.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>AI Damage Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced computer vision accurately assesses vehicle damage from uploaded photos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Fraud Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sophisticated algorithms detect fraudulent claims and protect against insurance fraud.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle>24/7 Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Submit and track claims anytime, anywhere. Our AI never sleeps, ensuring round-the-clock service.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
