
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Experience the Future?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of users who trust InsuroAI for their insurance claims
        </p>
        <Link to="/register">
          <Button size="lg" variant="secondary" className="px-8 py-3">
            Start Your Claim Today
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
