import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectTo({location}: {location: string}) {
    const router = useRouter();
    router.push(location);
    return undefined;
  }