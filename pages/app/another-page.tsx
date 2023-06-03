import BumpUnauthorised from '@/components/login/bump-unauthorised';
import BumpUnflagged from '@/components/login/bump-unflagged';

function Page() {
	return (
		<>
			<h1>Another page</h1>
			<section aria-label="sender">
				<form>
					<label htmlFor="Input">Send</label>
					<input id="input" type="text" />
				</form>
			</section>
		</>
	);
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
