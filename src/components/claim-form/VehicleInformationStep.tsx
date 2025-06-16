
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleInformationStepProps {
  formData: {
    vehicleYear: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleVin: string;
    vehiclePlate: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VehicleInformationStep = ({ formData, onInputChange }: VehicleInformationStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Vehicle Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleYear">Year</Label>
          <Input
            id="vehicleYear"
            name="vehicleYear"
            value={formData.vehicleYear}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleMake">Make</Label>
          <Input
            id="vehicleMake"
            name="vehicleMake"
            value={formData.vehicleMake}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleModel">Model</Label>
          <Input
            id="vehicleModel"
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehiclePlate">License Plate</Label>
          <Input
            id="vehiclePlate"
            name="vehiclePlate"
            value={formData.vehiclePlate}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="vehicleVin">VIN Number</Label>
          <Input
            id="vehicleVin"
            name="vehicleVin"
            value={formData.vehicleVin}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleInformationStep;
