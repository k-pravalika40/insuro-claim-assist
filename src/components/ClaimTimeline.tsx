
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

interface TimelineEvent {
  id: string;
  status: string;
  timestamp: string;
  description: string;
}

interface ClaimTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

const ClaimTimeline = ({ events, currentStatus }: ClaimTimelineProps) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'under review':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Claim Timeline</h3>
      <div className="relative">
        {events.map((event, index) => (
          <div key={event.id} className="flex items-start space-x-4 pb-4">
            {/* Timeline line */}
            {index < events.length - 1 && (
              <div className="absolute left-2.5 top-8 w-0.5 h-8 bg-gray-200"></div>
            )}
            
            {/* Status icon */}
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(event.status)}
            </div>
            
            {/* Event details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimTimeline;
