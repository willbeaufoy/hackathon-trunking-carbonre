import BumpUnauthorised from '@/components/login/bump-unauthorised';
import BumpUnflagged from '@/components/login/bump-unflagged';
import { doc, setDoc } from '@firebase/firestore';
import { useAuth, useFirestore, useFirestoreDocData } from 'reactfire';

function Page() {
	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const stalkerDoc = doc(firestore, `users/${uid}/stalker/1`);
	const { status, data } = useFirestoreDocData(stalkerDoc);

	const isLoading = status === 'loading';
	if (isLoading) {
		return <p>Loading...</p>;
	}

	const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const message = form.elements['input'].value;
		form.reset();
		setDoc(stalkerDoc, { message }).catch(console.error);
	};

	return (
		<>
			<h1>Another page</h1>
			<section aria-labelledby="h2sender">
				<h2 id="h2sender">Sender</h2>
				<form onSubmit={handleOnSubmit}>
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
			<section aria-labelledby="h2receiver">
				<h2 id="h2receiver">Receiver</h2>
				<p>{data?.message}</p>
			</section>
		</>
	);
}

export default function AnotherPage() {
	return (
		<BumpUnauthorised>
			{/* <BumpUnflagged flagName="another-page"> */}
			<Page />
			{/* </BumpUnflagged> */}
		</BumpUnauthorised>
	);
}
