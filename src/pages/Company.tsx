
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Globe, TrendingUp } from "lucide-react";
import BackButton from "@/components/BackButton";

const Company = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Mission & Vision
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building the future of insurance through innovation, technology, and customer-centric solutions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To revolutionize the insurance industry by leveraging artificial intelligence and automation 
                to create faster, more accurate, and more transparent claim processing experiences for everyone.
              </p>
              <p className="text-lg text-gray-600">
                We believe that technology should serve humanity, making complex processes simple and 
                giving people more time to focus on what matters most in their lives.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                To become the global leader in AI-powered insurance solutions, setting new standards 
                for efficiency, accuracy, and customer satisfaction in the industry.
              </p>
              <p className="text-lg text-gray-600">
                We envision a world where insurance claims are processed instantly, fraudulent activities 
                are prevented before they occur, and every customer receives fair and timely compensation.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We continuously push the boundaries of what's possible with AI and machine learning.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Customer First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Every decision we make is guided by how it will improve our customers' experiences.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Global Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We're building solutions that can transform insurance markets worldwide.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle>Excellence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We strive for excellence in everything we do, from code quality to customer service.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2023 by a team of insurance industry veterans and AI researchers, InsuroAI 
              was born from the frustration of dealing with slow, inefficient claim processes.
            </p>
            <p className="text-gray-600 mb-4">
              Our founders recognized that while the insurance industry had been slow to adopt 
              new technologies, the potential for AI to transform the sector was enormous.
            </p>
            <p className="text-gray-600">
              Today, we're proud to be at the forefront of this transformation, helping insurance 
              companies and their customers benefit from faster, more accurate claim processing.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-gray-600 mb-4">
              Our diverse team brings together expertise from insurance, artificial intelligence, 
              software engineering, and customer experience design.
            </p>
            <p className="text-gray-600 mb-4">
              With backgrounds from leading technology companies and insurance firms, our team 
              understands both the technical challenges and business needs of the industry.
            </p>
            <p className="text-gray-600">
              We're united by a shared passion for using technology to solve real-world problems 
              and improve people's lives.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Choose InsuroAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry Expertise</h3>
              <p className="text-gray-600">
                Deep understanding of insurance processes and regulations combined with cutting-edge AI technology.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Proven Results</h3>
              <p className="text-gray-600">
                Our platform has processed thousands of claims with 99.7% accuracy and 95% customer satisfaction.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Continuous Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our algorithms and add new features based on user feedback and industry trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;
