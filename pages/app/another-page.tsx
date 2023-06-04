import BumpUnauthorised from '@/components/login/bump-unauthorised';
import BumpUnflagged from '@/components/login/bump-unflagged';

function Page() {
	return (
		<>
			<h1>Another page</h1>
			<section aria-labelledby="h2sender">
				<h2 id="h2sender">Sender</h2>
				<form>
					<label htmlFor="Input">Send</label>
					<input id="input" type="text" />
					<button
						type="submit"
						className="block w-36 rounded-full bg-green-300 bg-center py-3 text-center text-base font-normal text-black shadow-xl hover:bg-green-400 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 sm:w-72"
					>
						Send
					</button>
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
