import Layout from '@/components/layout';
import '@/styles/globals.css'
import FirebaseComponent from '@/components/firebase-component';

export default function App({ Component, pageProps }) {
  return (
      <FirebaseComponent>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FirebaseComponent>
  )
}
