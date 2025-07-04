
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

interface ImageViewerProps {
  imageUrl: string;
  fileName: string;
}

const ImageViewer = ({ imageUrl, fileName }: ImageViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{fileName}</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center">
                {isLoading && (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={fileName}
                  className="max-w-full max-h-96 object-contain"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                  style={{ display: isLoading ? 'none' : 'block' }}
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
      <img
        src={imageUrl}
        alt={fileName}
        className="w-full h-24 object-cover rounded"
        loading="lazy"
      />
    </div>
  );
};

export default ImageViewer;
