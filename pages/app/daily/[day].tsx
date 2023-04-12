import BumpUnauthorised from '@/components/bump-unauthorised';
import Layout from '@/components/layout';
import { collection, doc, setDoc } from 'firebase/firestore';
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

interface WeeklyOutcomeData {
	hotSpot: string; // TODO: make this a union type
	outcome: string;
	day: string;
}

interface WeeklyOutcomeProps {
	hotSpot: string;
	outcome: string;

	handleSave: (weeklyOutcome: { hotSpot: string; outcome: string }) => void;
}

function WeeklyOutcome({ hotSpot, outcome, handleSave }: WeeklyOutcomeProps) {
	const handleOnSubmit = event => {
		event.preventDefault();
		const hotSpot = event.target.elements.hotSpot.value;
		const outcome = event.target.elements.outcome.value;
		handleSave({ hotSpot, outcome });
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
				placeholder="Enter your Weekly outcome"
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

const emptyWeeklyOutcome = {
	hotSpot: '',
	outcome: '',
};
const idField = 'id';

function WeeklyOutcomes() {
	const router = useRouter();
	const { day } = router.query;

	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const weeklyOutcomesCollection = collection(
		firestore,
		`users/${uid}/weeklyOutcomes/`,
	);
	const { status, data: weeklyOutcomes } = useFirestoreCollectionData(
		weeklyOutcomesCollection,
		{ idField },
	);

	const saveWeeklyOutcome = useCallback(
		(id: string) => (outcome: WeeklyOutcomeData) =>
			setDoc(doc(weeklyOutcomesCollection, id), outcome).catch(console.error),
		[weeklyOutcomesCollection],
	);

	useEffect(() => {
		if (status !== 'success') return;
		if (!weeklyOutcomes || weeklyOutcomes.length === 0) {
			[...Array(3)].map((_, i) =>
				saveWeeklyOutcome(`${i}`)({
					...emptyWeeklyOutcome,
					day: day as string,
				}),
			);
		}
	}, [status, weeklyOutcomes, saveWeeklyOutcome, day]);

	const isLoading = status === 'loading';
	const hasWeeklyOutcomes = weeklyOutcomes && weeklyOutcomes.length > 0;
	if (isLoading || !hasWeeklyOutcomes) {
		return <p>Loading...</p>;
	}

	return (
		<section aria-label="Weekly Outcomes">
			<h2>Weekly Outcomes</h2>
			<ul className="list-inside list-none space-y-8 pl-0 text-gray-500 dark:text-gray-400">
				{weeklyOutcomes.map(({ hotSpot, outcome, id }) => (
					<li key={id}>
						<WeeklyOutcome
							hotSpot={hotSpot}
							outcome={outcome}
							handleSave={saveWeeklyOutcome(id)}
						/>
					</li>
				))}
			</ul>
		</section>
	);
}

function DailyOutcome({ hotSpot, outcome, handleSave }: WeeklyOutcomeProps) {
	const handleOnSubmit = event => {
		event.preventDefault();
		const hotSpot = event.target.elements.hotSpot.value;
		const outcome = event.target.elements.outcome.value;
		handleSave({ hotSpot, outcome });
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
				placeholder="Enter your Daily outcome"
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

function DailyOutcomes() {
	const router = useRouter();
	const { day } = router.query;

	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const dailyOutcomesCollection = collection(
		firestore,
		`users/${uid}/dailyOutcomes/`,
	);
	const { status, data: dailyOutcomes } = useFirestoreCollectionData(
		dailyOutcomesCollection,
		{ idField },
	);

	const saveDailyOutcome = useCallback(
		(id: string) => (outcome: WeeklyOutcomeData) =>
			setDoc(doc(dailyOutcomesCollection, id), outcome).catch(console.error),
		[dailyOutcomesCollection],
	);

	useEffect(() => {
		if (status !== 'success') return;
		if (!dailyOutcomes || dailyOutcomes.length === 0) {
			[...Array(3)].map((_, i) =>
				saveDailyOutcome(`${i}`)({
					...emptyWeeklyOutcome,
					day: day as string,
				}),
			);
		}
	}, [status, saveDailyOutcome, day, dailyOutcomes]);

	const isLoading = status === 'loading';
	const hasDailyOutcomes = dailyOutcomes && dailyOutcomes.length > 0;
	if (isLoading || !hasDailyOutcomes) {
		return <p>Loading...</p>;
	}

	return (
		<section aria-label="Daily Outcomes">
			<h2>Daily Outcomes</h2>
			<ul className="list-inside list-none space-y-8 pl-0 text-gray-500 dark:text-gray-400">
				{dailyOutcomes.map(({ hotSpot, outcome, id }) => (
					<li key={id}>
						<DailyOutcome
							hotSpot={hotSpot}
							outcome={outcome}
							handleSave={saveDailyOutcome(id)}
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
				<WeeklyOutcomes />
				<DailyOutcomes />
				{/* <section>
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
				</section> */}
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
