
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

interface DocumentUploadStepProps {
  uploadedFiles: File[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

const DocumentUploadStep = ({ uploadedFiles, onFileUpload, onRemoveFile }: DocumentUploadStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload Documents</h3>
      <p className="text-gray-600">
        Please upload photos of the damage and any relevant documents (PDFs, images)
      </p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <Label htmlFor="fileUpload" className="cursor-pointer">
          <span className="text-blue-600 hover:text-blue-500 font-medium">
            Click to upload files
          </span>
          <span className="text-gray-600"> or drag and drop</span>
        </Label>
        <Input
          id="fileUpload"
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={onFileUpload}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-2">
          PNG, JPG, PDF up to 10MB each
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm text-gray-700">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUploadStep;
