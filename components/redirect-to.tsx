import { useRouter } from "next/router";
import { useEffect } from "react"

export default function RedirectTo({to}: {to: string}) {
    const router = useRouter();
    
    useEffect(() =>{
        router.push(to);
    })
    return <></>
}