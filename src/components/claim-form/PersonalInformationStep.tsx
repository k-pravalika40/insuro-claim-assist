
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInformationStepProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    policyNumber: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInformationStep = ({ formData, onInputChange }: PersonalInformationStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="policyNumber">Policy Number</Label>
          <Input
            id="policyNumber"
            name="policyNumber"
            value={formData.policyNumber}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationStep;
