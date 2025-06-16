
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IncidentDetailsStepProps {
  formData: {
    incidentDate: string;
    incidentTime: string;
    incidentLocation: string;
    claimType: string;
    description: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const IncidentDetailsStep = ({ formData, onInputChange }: IncidentDetailsStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Incident Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="incidentDate">Date of Incident</Label>
          <Input
            id="incidentDate"
            name="incidentDate"
            type="date"
            value={formData.incidentDate}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="incidentTime">Time of Incident</Label>
          <Input
            id="incidentTime"
            name="incidentTime"
            type="time"
            value={formData.incidentTime}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="incidentLocation">Location of Incident</Label>
          <Input
            id="incidentLocation"
            name="incidentLocation"
            value={formData.incidentLocation}
            onChange={onInputChange}
            placeholder="Street address, city, state"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="claimType">Type of Claim</Label>
          <select
            id="claimType"
            name="claimType"
            value={formData.claimType}
            onChange={onInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="">Select claim type</option>
            <option value="collision">Collision</option>
            <option value="comprehensive">Comprehensive</option>
            <option value="theft">Theft</option>
            <option value="vandalism">Vandalism</option>
            <option value="weather">Weather Damage</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description of Incident</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Please describe what happened..."
            required
          />
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailsStep;
