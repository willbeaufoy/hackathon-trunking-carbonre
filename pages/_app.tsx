import FirebaseComponents from '@/components/firebase-components';
import { firebaseConfig } from '@/firebase.config';
import '@/styles/globals.css'
import { FirebaseAppProvider } from 'reactfire';

export default function App({ Component, pageProps }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseComponents>
        <Component {...pageProps} />
      </FirebaseComponents>
    </FirebaseAppProvider>
  )
}
