
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailData {
  userName?: string;
  claimId?: string;
  status?: string;
  claimType?: string;
}

export const useEmailNotifications = () => {
  const { toast } = useToast();

  const sendEmail = async (
    to: string,
    type: 'claim_status_update' | 'claim_submitted' | 'welcome',
    data: EmailData
  ) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          to,
          type,
          data
        }
      });

      if (error) {
        console.error('Email sending error:', error);
        toast({
          title: "Email Error",
          description: "Failed to send notification email",
          variant: "destructive",
        });
        return false;
      }

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Email Error",
        description: "Failed to send notification email",
        variant: "destructive",
      });
      return false;
    }
  };

  const sendClaimStatusUpdate = async (userEmail: string, claimId: string, status: string, claimType?: string, userName?: string) => {
    return await sendEmail(userEmail, 'claim_status_update', {
      userName,
      claimId,
      status,
      claimType
    });
  };

  const sendClaimSubmitted = async (userEmail: string, claimId: string, claimType?: string, userName?: string) => {
    return await sendEmail(userEmail, 'claim_submitted', {
      userName,
      claimId,
      claimType
    });
  };

  const sendWelcomeEmail = async (userEmail: string, userName?: string) => {
    return await sendEmail(userEmail, 'welcome', {
      userName
    });
  };

  return {
    sendClaimStatusUpdate,
    sendClaimSubmitted,
    sendWelcomeEmail
  };
};
