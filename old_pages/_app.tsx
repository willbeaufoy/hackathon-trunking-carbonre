import FirebaseComponents from '@/old_pages/components/firebase-components';
import Layout from '@/old_pages/components/layout';
import { firebaseConfig } from '@/firebase.config';
import '@/styles/globals.css'
import { FirebaseAppProvider } from 'reactfire';

export default function App({ Component, pageProps }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
      <FirebaseComponents>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FirebaseComponents>
    </FirebaseAppProvider>
  )
}
