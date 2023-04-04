import { firebaseConfig } from '@/firebase.config';
import { getAuth, connectAuthEmulator } from 'firebase/auth'; // Firebase v9+
import { connectFirestoreEmulator } from 'firebase/firestore';
import { useEffect } from 'react';
import { getFirestore } from "firebase/firestore";

import { AuthProvider, FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from 'reactfire';

// TODO AppCheck
// TODO Analytics
// TODO Performance
// TODO SSR auth

export function MyFirebaseComponent({ children }) {
    const app = useFirebaseApp();
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_EMULATOR === 'true') {
            connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8080);
        }
    }, [app, auth])

    return (
        <AuthProvider sdk={auth}>
            <FirestoreProvider sdk={db}>
                {children}
            </FirestoreProvider>
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
