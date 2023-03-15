import { getAuth, connectAuthEmulator } from 'firebase/auth'; // Firebase v9+
import { useEffect } from 'react';

import { AuthProvider, useFirebaseApp } from 'reactfire';

// TODO AppCheck
// TODO Analytics
// TODO Performance
// TODO SSR auth

export default function FirebaseComponents({ children }) {
    const app = useFirebaseApp();
    const auth = getAuth(app);

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_EMULATOR === 'true') {
            connectAuthEmulator(auth, 'http://127.0.0.1:9099', {disableWarnings: true});
        }
    }, [app])

    return (
        <AuthProvider sdk={auth}>
            {children}
        </AuthProvider>
    );
}
