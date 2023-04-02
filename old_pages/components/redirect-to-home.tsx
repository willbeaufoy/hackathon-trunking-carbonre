import { useRouter } from "next/router";
import { useEffect } from "react";

export function RedirectToHome() {
    const router = useRouter();
    useEffect(() => {
      router.push("/");
    }, [])
    return undefined;
  }