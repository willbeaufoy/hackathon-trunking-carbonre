import { isFeatureSet } from '../feature-flags';
import RedirectTo from './redirect-to';

export default function BumpUnflagged({ children, flagName }) {
	if (!isFeatureSet(flagName)) {
		return <RedirectTo to="/" />;
	}

	return children;
}
