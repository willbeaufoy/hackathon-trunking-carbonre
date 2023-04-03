import { firebaseConfig } from '@/firebase.config';
import { getAuth, connectAuthEmulator } from 'firebase/auth'; // Firebase v9+
import { useEffect } from 'react';

import { AuthProvider, FirebaseAppProvider, useFirebaseApp } from 'reactfire';

// TODO AppCheck
// TODO Analytics
// TODO Performance
// TODO SSR auth

export function MyFirebaseComponent({ children }) {
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

export default function FirebaseComponent({ children }) {
    return (
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <MyFirebaseComponent>
            {children}
        </MyFirebaseComponent>
      </FirebaseAppProvider>
    )
  }
  