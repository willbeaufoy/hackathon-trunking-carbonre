import BumpUnauthorised from '@/components/bump-unauthorised';
import Layout from '@/components/layout';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
	useAuth,
	useFirestore,
	useFirestoreCollectionData,
	useFirestoreDocData,
} from 'reactfire';

interface WeeklyOutcomeProps {
	hotSpot?: string;
	outcome?: string;
	handleSave: (event: React.FormEvent<HTMLFormElement>) => void;
}

function WeeklyOutcome({ hotSpot, outcome, handleSave }: WeeklyOutcomeProps) {
	return (
		<form onSubmit={handleSave}>
			<select name="hotSpot" aria-label="Hot spot" defaultValue={hotSpot || ''}>
				<option value="" disabled>
					Select a hot spot
				</option>
				<option value="Mind">Mind</option>
				<option value="Body">Body</option>
				<option value="Relationships">Relationships</option>
			</select>
			<input
				type="text"
				name="outcome"
				placeholder="Enter your Weekly outcome"
				defaultValue={outcome || ''}
			/>
			<button type="submit">Save</button>
		</form>
	);
}

function Page() {
	const router = useRouter();
	const { day } = router.query;

	// get a collection of weekly outcomes from firestore at this path users/${uid}/weeks/thisWeek/weeklyOutcomes
	// if there is no collection, create one with 3 empty objects
	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const weeklyOutcomesCollection = collection(
		firestore,
		`users/${uid}/weeks/thisWeek/weeklyOutcomes`,
	);
	const { status, data: weeklyOutcomes } = useFirestoreCollectionData(
		weeklyOutcomesCollection,
		{
			idField: 'id',
		},
	);

	const handleSave = id => event => {
		event.preventDefault();
		const hotSpot = event.target.elements.hotSpot.value;
		const outcome = event.target.elements.outcome.value;
		setDoc(doc(weeklyOutcomesCollection, id), { hotSpot, outcome }).catch(
			console.error,
		);
	};

	useEffect(() => {
		if (status !== 'success') return;
		if (!weeklyOutcomes || weeklyOutcomes.length === 0) {
			const promises = [...Array(3)].map((_, i) =>
				setDoc(doc(weeklyOutcomesCollection, i.toString()), {
					hotSpot: '',
					outcome: '',
				}),
			);
			Promise.all(promises).catch(console.error);
		}
	}, [status, weeklyOutcomes, weeklyOutcomesCollection]);

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	if (!weeklyOutcomes || weeklyOutcomes.length === 0) {
		return <></>;
	}

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
						{weeklyOutcomes.map(({ hotSpot, outcome, id }) => (
							<li key={id}>
								<WeeklyOutcome
									hotSpot={hotSpot}
									outcome={outcome}
									handleSave={handleSave(id)}
								/>
							</li>
						))}
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
