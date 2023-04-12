import { firebaseConfig } from '@/firebase.config';
import { connectAuthEmulator, getAuth } from 'firebase/auth'; // Firebase v9+
import {
	connectFirestoreEmulator,
	enableIndexedDbPersistence,
	initializeFirestore,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { isBrowser } from '@firebase/util';
import {
	AuthProvider,
	FirebaseAppProvider,
	FirestoreProvider,
	useFirebaseApp,
	useInitFirestore,
} from 'reactfire';

// TODO AppCheck
// TODO Analytics
// TODO Performance
// TODO SSR auth
const USE_EMULATOR = process.env.NEXT_PUBLIC_EMULATOR === 'true';

export function AuthComponent({ children }) {
	const app = useFirebaseApp();
	const auth = getAuth(app);

	useEffect(() => {
		if (USE_EMULATOR) {
			try {
				connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
					disableWarnings: true,
				});
			} catch (e: any) {
				if (e.code !== 'auth/emulator-config-failed') throw e;
			}
		}
	}, [app, auth]);

	return <AuthProvider sdk={auth}>{children}</AuthProvider>;
}

export function FirestoreComponent({ children }) {
	const { status, data: firestore } = useInitFirestore(
		async firebaseApp => {
			const db = initializeFirestore(firebaseApp, {});

			try {
				if (USE_EMULATOR) connectFirestoreEmulator(db, 'localhost', 8080);
				if (isBrowser()) await enableIndexedDbPersistence(db);
			} catch (error) {
				// React.StrictMode will make this error appear, but it's safe to ignore
				if (error.code !== 'failed-precondition') throw error;
			}

			return db;
		},
		{ suspense: false },
	);

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	return <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>;
}

export default function FirebaseComponent({ children }) {
	return (
		<FirebaseAppProvider firebaseConfig={firebaseConfig}>
			<AuthComponent>
				<FirestoreComponent>{children}</FirestoreComponent>
			</AuthComponent>
		</FirebaseAppProvider>
	);
}
