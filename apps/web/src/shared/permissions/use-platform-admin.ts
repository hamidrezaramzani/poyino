import { isPlatformAdmin, type PlatformRole } from "@poyino/contracts";
import { useSession } from "../../shared/session/session-provider";

export function useIsPlatformAdmin() {
  const { user } = useSession();
  return isPlatformAdmin(user?.platformRole as PlatformRole | undefined);
}
