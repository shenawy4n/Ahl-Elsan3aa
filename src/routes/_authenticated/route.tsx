import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ahlelsan3a_admin_session");
      if (stored) {
        try {
          const session = JSON.parse(stored);
          if (session && session.email) {
            return {
              user: {
                id: session.id || "admin-shenawyjr",
                email: session.email,
                app_metadata: {},
                user_metadata: {},
                aud: "authenticated",
                created_at: session.authenticated_at || new Date().toISOString(),
              },
            };
          }
        } catch {
          // ignore
        }
      }
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
