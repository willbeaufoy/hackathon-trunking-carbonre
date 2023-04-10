import '@/styles/globals.css';
import FirebaseComponent from '@/components/firebase-component';

export default function App({ Component, pageProps }) {
	return (
		<FirebaseComponent>
			<Component {...pageProps} />
		</FirebaseComponent>
	);
}
