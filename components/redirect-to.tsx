import { useRouter } from "next/router";
import { useEffect } from "react";

export function RedirectTo({to}: {to: string}) {
    const router = useRouter();
    useEffect(() => {
      router.push(to);
    }, [])
    return undefined;
  }