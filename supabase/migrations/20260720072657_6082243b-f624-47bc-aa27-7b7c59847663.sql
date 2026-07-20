-- Restrict has_role() SECURITY DEFINER function so it is not callable by
-- anon or authenticated API roles. Admin check now runs via a direct
-- RLS-scoped select on user_roles.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Ensure users can read their own role rows (needed for the admin check).
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
