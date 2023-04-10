import { useRouter } from 'next/router';
import { useSigninCheck } from 'reactfire';
import { Loading } from './loading';
import RedirectTo from './redirect-to';

export default function CheckNotSignedIn({ children }) {
	const { data, status } = useSigninCheck();
	const router = useRouter();

	if (status === 'loading') return <Loading />;

	const { user } = data;
	if (user && user.emailVerified) {
		return <RedirectTo to="/app/daily/today" />;
	}

	if (user && !user.emailVerified && router.pathname !== '/validate-email') {
		return <RedirectTo to="/validate-email" />;
	}

	return children;
}
