import { useSigninCheck } from 'reactfire';
import { Loading } from './loading';
import RedirectTo from './redirect-to';

export default function BumpUnauthorised({ children }) {
	const { data, status } = useSigninCheck();

	if (status === 'loading') return <Loading />;

	const { user } = data;
	if (!user) {
		return <RedirectTo to="/" />;
	}

	if (!user.emailVerified) {
		return <RedirectTo to="/validate-email" />;
	}

	return children;
}
