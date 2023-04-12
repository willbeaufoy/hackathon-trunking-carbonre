import { firebaseConfig } from '@/firebase.config';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'; // Firebase v9+
import {
	connectFirestoreEmulator,
	enableIndexedDbPersistence,
	Firestore,
	initializeFirestore,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';

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
	const app = useFirebaseApp();
	const db = getFirestore(app);

	useEffect(() => {
		if (USE_EMULATOR) {
			try {
				connectFirestoreEmulator(db, 'localhost', 8080);
			} catch (e: any) {
				if (e.code !== 'auth/emulator-config-failed') throw e;
			}
		}
	}, [app, db]);

	return <FirestoreProvider sdk={db}>{children}</FirestoreProvider>;
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
