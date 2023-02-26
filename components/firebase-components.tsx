import { getAuth, connectAuthEmulator } from 'firebase/auth'; // Firebase v9+

import { AuthProvider, useFirebaseApp } from 'reactfire';

// TODO app check
// TODO SSR auth

export default function FirebaseComponents({ children }) {
    const app = useFirebaseApp();
    const auth = getAuth(app);

    // Check for dev/test mode however your app tracks that.
    // `process.env.NODE_ENV` is a common React pattern
    if (process.env.NODE_ENV !== 'production') {
        // Set up emulators
        connectAuthEmulator(auth, 'http://localhost:9099');
    }

    // useInitPerformance(
    //     async (firebaseApp) => {
    //         const { getPerformance } = await import('firebase/performance');
    //         return getPerformance(firebaseApp);
    //     },
    //     { suspense: false } // false because we don't want to stop render while we wait for perf
    // );

    return (
        <AuthProvider sdk={auth}>
            {children}
        </AuthProvider>
    );
}

function useInitPerformance(arg0: (firebaseApp: any) => Promise<import("firebase/performance").FirebasePerformance>, arg1: { suspense: boolean; }) {
    throw new Error('Function not implemented.');
}
