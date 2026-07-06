import PortalShell from "@/components/PortalShell";
import { requireStaffSession } from "@/lib/auth/session";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await requireStaffSession();
  return <PortalShell staff={session.staff}>{children}</PortalShell>;
}
