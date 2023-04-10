import { firebaseConfig } from '@/firebase.config';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'; // Firebase v9+
import { connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';

import {
	AuthProvider,
	FirebaseAppProvider,
	FirestoreProvider,
	useFirebaseApp,
} from 'reactfire';

// TODO AppCheck
// TODO Analytics
// TODO Performance
// TODO SSR auth

function setupEmulator(auth: Auth, db: Firestore) {
	if (process.env.NEXT_PUBLIC_EMULATOR === 'true') {
		try {
			connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
				disableWarnings: true,
			});
			connectFirestoreEmulator(db, 'localhost', 8080);
		} catch (e: any) {
			if (e.code !== 'auth/emulator-config-failed') throw e;
		}
	}
}

export function MyFirebaseComponent({ children }) {
	const app = useFirebaseApp();
	const auth = getAuth(app);
	const db = getFirestore(app);

	useEffect(() => {
		setupEmulator(auth, db);
	}, [app, auth, db]);

	return (
		<AuthProvider sdk={auth}>
			<FirestoreProvider sdk={db}>{children}</FirestoreProvider>
		</AuthProvider>
	);
}
export default function FirebaseComponent({ children }) {
	return (
		<FirebaseAppProvider firebaseConfig={firebaseConfig}>
			<MyFirebaseComponent>{children}</MyFirebaseComponent>
		</FirebaseAppProvider>
	);
}
