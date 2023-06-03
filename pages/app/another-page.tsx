import BumpUnauthorised from '@/components/login/bump-unauthorised';
import BumpUnflagged from '@/components/login/bump-unflagged';

function Page() {
	return <h1>Another page</h1>;
}

export default function AnotherPage() {
	return (
		<BumpUnauthorised>
			<BumpUnflagged flagName="another-page">
				<Page />
			</BumpUnflagged>
		</BumpUnauthorised>
	);
}
