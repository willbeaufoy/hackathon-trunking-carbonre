import BumpUnauthorised from '@/components/bump-unauthorised';
import Layout from '@/components/layout';
import {
	addDoc,
	collection,
	doc,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useAuth, useFirestore, useFirestoreCollectionData } from 'reactfire';

const HOTSPOTS = [
	'Mind',
	'Body',
	'Relationships',
	'Emotions',
	'Career',
	'Fun',
] as const;

const idField = 'id';

interface OutcomeProps extends Outcome {
	handleSave: (outcome: Outcome) => void;
}
function Outcome({
	hotSpot,
	outcome,
	type,
	date,
	id,
	handleSave,
}: OutcomeProps) {
	const handleOnSubmit = event => {
		event.preventDefault();
		const hotSpot = event.target.elements.hotSpot.value;
		const outcome = event.target.elements.outcome.value;
		handleSave({ hotSpot, outcome, date, type, id });
	};

	return (
		<form onSubmit={handleOnSubmit} className="space-y-2">
			<select
				name="hotSpot"
				aria-label="Hot spot"
				defaultValue={hotSpot || ''}
				className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			>
				<option value="" disabled>
					Select a hot spot
				</option>
				{HOTSPOTS.map(hotSpot => (
					<option key={hotSpot} value={hotSpot}>
						{hotSpot}
					</option>
				))}
			</select>
			<textarea
				className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				rows={3}
				name="outcome"
				placeholder="Enter your outcome"
				defaultValue={outcome || ''}
			/>
			<button
				type="submit"
				className="block w-36 rounded-full bg-green-300 bg-center py-3 text-center text-base font-normal text-black shadow-xl hover:bg-green-400 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 sm:w-72"
			>
				Save
			</button>
			<br />
		</form>
	);
}

interface Outcome {
	id: string;
	hotSpot: string;
	outcome: string;
	date: string;
	type: string;
}

function Outcomes({ type }: { type: string }) {
	const router = useRouter();
	const { day } = router.query;

	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const outcomesCollection = collection(firestore, `users/${uid}/outcomes/`);
	const outcomesQuery = query(outcomesCollection, where('type', '==', type));
	const { status, data } = useFirestoreCollectionData(outcomesQuery, {
		idField,
	});
	const outcomes = data as Outcome[];

	const saveOutcome = useCallback(
		({ id, hotSpot, outcome, date = day as string, type }: Outcome) =>
			setDoc(doc(outcomesCollection, id), {
				hotSpot,
				outcome,
				date,
				type,
			}).catch(console.error),
		[day, outcomesCollection],
	);

	useEffect(() => {
		const isLoaded = status === 'success';
		const hasOutcomes = outcomes && outcomes.length > 0;
		if (!isLoaded || hasOutcomes) return;
		[...Array(3)].map((_, i) =>
			addDoc(outcomesCollection, {
				hotSpot: '',
				outcome: '',
				date: day as string,
				type,
			}),
		);
	}, [day, outcomes, outcomesCollection, status, type]);

	const isLoading = status === 'loading';
	const hasOutcomes = outcomes && outcomes.length > 0;
	if (isLoading || !hasOutcomes) {
		return <p>Loading...</p>;
	}

	const capitalisedType = type.charAt(0).toUpperCase() + type.slice(1);

	return (
		<section aria-label={`${capitalisedType} Outcomes`}>
			<h2>{`${capitalisedType} Outcomes`}</h2>
			<ul className="list-inside list-none space-y-8 pl-0 text-gray-500 dark:text-gray-400">
				{outcomes.map(({ hotSpot, outcome, date, type, id }) => (
					<li key={id}>
						<Outcome
							{...{ hotSpot, outcome, date, type, id }}
							handleSave={saveOutcome}
						/>
					</li>
				))}
			</ul>
		</section>
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
				<Outcomes type="weekly" />
				<Outcomes type="daily" />
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
