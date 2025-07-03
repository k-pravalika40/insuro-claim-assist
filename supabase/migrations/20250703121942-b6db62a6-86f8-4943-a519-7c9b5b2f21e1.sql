
-- Create admin roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own roles
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for admins to manage all roles
CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update claims table policies to allow admin access
CREATE POLICY "Admins can manage all claims" 
  ON public.claims 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create admin stats view
CREATE OR REPLACE VIEW public.admin_claim_stats AS
SELECT 
  COUNT(*) as total_claims,
  COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_claims,
  COUNT(CASE WHEN status = 'Approved' THEN 1 END) as approved_claims,
  COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected_claims,
  AVG(CASE WHEN status = 'Approved' THEN EXTRACT(DAY FROM (updated_at - created_at)) END) as avg_processing_days
FROM public.claims;
