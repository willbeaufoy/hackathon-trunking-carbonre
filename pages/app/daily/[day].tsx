import BumpUnauthorised from '@/components/bump-unauthorised';
import Layout from '@/components/layout';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth, useFirestore, useFirestoreDocData } from 'reactfire';

function WeeklyOutcome() {
	// how to use reactfire to get an element out of a collection?
	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const daysCollection = collection(firestore, `users/${uid}/days`);

	// get 1 from days collection
	const day = doc(daysCollection, '1');
	const { status, data: dayData } = useFirestoreDocData(day);

	useEffect(() => {
		setDoc(doc(daysCollection, '1'), {
			weekly: {
				hotSpot: 'Mind',
				outcome: 'I am a Mind weekly outcome',
			},
		}).catch(console.error);
	}, [daysCollection]);

	if (status === 'loading') return <p>Loading...</p>;

	return (
		<form onSubmit={e => e.preventDefault()}>
			<select
				aria-label="Hot spot"
				defaultValue={dayData?.weekly.hotSpot || ''}
			>
				<option value="" disabled>
					Select a hot spot
				</option>
				<option value="Mind">Mind</option>
				<option value="Body">Body</option>
				<option value="Relationships">Relationships</option>
			</select>
			<input
				type="text"
				placeholder="Enter your Weekly outcome"
				defaultValue={dayData?.weekly.outcome}
			/>
			<button type="submit">Save</button>
		</form>
	);
}

function Page() {
	const router = useRouter();
	const { day } = router.query;
	return (
		<>
			<br />
			<main className="format mx-auto max-w-xs sm:max-w-screen-md">
				<section>
					<h1>{day}</h1>
					<h2>Sat 8th Apr</h2>
				</section>
				<section aria-label="Weekly Outcomes">
					<h2>Weekly Outcomes</h2>
					<ul>
						<li>
							<WeeklyOutcome />
						</li>
						<li>
							<WeeklyOutcome />
						</li>
						<li>
							<WeeklyOutcome />
						</li>
					</ul>
				</section>
				<section>
					<h2>Daily Outcomes</h2>
					<ul>
						<li>
							<input
								type="text"
								id="email"
								className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								placeholder="Enter your Daily outcome"
								defaultValue="Daily outcome 1"
							/>
						</li>
						<li>
							<input
								type="text"
								id="email"
								className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								placeholder="Enter your Daily outcome"
								defaultValue="Daily outcome 2"
							/>
						</li>
						<li>
							<input
								type="text"
								id="email"
								className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								placeholder="Enter your Daily outcome"
							/>
						</li>
					</ul>
				</section>
				<section>
					<h2>Retro</h2>
					<ul>
						<li>
							<input
								type="text"
								id="email"
								className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								placeholder="Enter your Retro"
								defaultValue="Retro 1"
							/>
						</li>
						<li>
							<input
								type="text"
								id="email"
								className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								placeholder="Enter your Retro"
								defaultValue="Retro 2"
							/>
						</li>
						<li>
							<input
								type="text"
								id="email"
								className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								placeholder="Enter your Retro"
							/>
						</li>
					</ul>
				</section>
			</main>
		</>
	);
}

export default function DailyFocus() {
	return (
		<BumpUnauthorised>
			<Layout>
				<Page />
			</Layout>
		</BumpUnauthorised>
	);
}
