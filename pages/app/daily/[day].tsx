import BumpUnauthorised from '@/components/bump-unauthorised';
import Layout from '@/components/layout';
import {
	addDoc,
	collection,
	doc,
	orderBy,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import Link from 'next/link';
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

interface Outcome {
	id: string;
	index: number;
	date: string;
	type: string;
	hotSpot: string;
	outcome: string;
}

interface OutcomeProps extends Outcome {
	handleSave: (outcome: Outcome) => void;
}
function Outcome({ hotSpot, outcome, handleSave, ...rest }: OutcomeProps) {
	const handleOnSubmit = event => {
		event.preventDefault();
		const hotSpot = event.target.elements.hotSpot.value;
		const outcome = event.target.elements.outcome.value;
		handleSave({ ...rest, hotSpot, outcome });
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

function Outcomes({ period, date }: { period: string; date: string }) {
	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const outcomesCollection = collection(firestore, `users/${uid}/notes/`);
	const outcomesQuery = query(
		outcomesCollection,
		where('type', '==', 'outcome'),
		where('period', '==', period),
		where('date', '==', date),
		orderBy('date', 'asc'),
		orderBy('index', 'asc'),
	);
	const { status, data } = useFirestoreCollectionData(outcomesQuery, {
		idField,
	});
	const outcomes = data as Outcome[];

	const saveOutcome = useCallback(
		(outcome: Outcome) =>
			setDoc(doc(outcomesCollection, outcome.id), outcome).catch(console.error),
		[outcomesCollection],
	);

	useEffect(() => {
		const isLoaded = status === 'success';
		const hasOutcomes = outcomes && outcomes.length > 0;
		if (!isLoaded || hasOutcomes) return;
		[...Array(3)].map((_, index) =>
			addDoc(outcomesCollection, {
				date,
				index,
				type: 'outcome',
				period,
				hotSpot: '',
				outcome: '',
			}),
		);
	}, [date, outcomes, outcomesCollection, period, status]);

	const isLoading = status === 'loading';
	const hasOutcomes = outcomes && outcomes.length > 0;
	if (isLoading || !hasOutcomes) {
		return <p>Loading...</p>;
	}

	const capitalisedType = period.charAt(0).toUpperCase() + period.slice(1);

	return (
		<section aria-label={`${capitalisedType} Outcomes`}>
			<h2>{`${capitalisedType} Outcomes`}</h2>
			<ul className="list-inside list-none space-y-8 pl-0 text-gray-500 dark:text-gray-400">
				{outcomes.map(outcome => (
					<li key={outcome.id}>
						<Outcome {...{ ...outcome }} handleSave={saveOutcome} />
					</li>
				))}
			</ul>
		</section>
	);
}

interface RetroNote {
	id: string;
	index: number;
	date: string;
	type: string;
	period: string;
	retronote: string;
}

interface RetroNoteProps extends RetroNote {
	handleSave: (retronote: RetroNote) => void;
}

function RetroNote({ retronote, handleSave, ...rest }: RetroNoteProps) {
	const handleOnSubmit = event => {
		event.preventDefault();
		const retronote = event.target.elements.retronote.value;
		handleSave({ ...rest, retronote });
	};

	return (
		<form onSubmit={handleOnSubmit} className="space-y-2">
			<textarea
				className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				rows={3}
				name="retronote"
				placeholder="Enter your retro note"
				defaultValue={retronote || ''}
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

function RetroNotes({ period, date }: { period: string; date: string }) {
	const router = useRouter();
	const { day } = router.query;

	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const retroCollection = collection(firestore, `users/${uid}/notes/`);
	const retroQuery = query(
		retroCollection,
		where('type', '==', 'retro'),
		where('period', '==', period),
		where('date', '==', date),
		orderBy('date', 'asc'),
		orderBy('index', 'asc'),
	);

	const { status, data } = useFirestoreCollectionData(retroQuery, {
		idField,
	});
	const retroNotes = data as RetroNote[];

	const saveRetroNote = useCallback(
		(retroNote: RetroNote) =>
			setDoc(doc(retroCollection, retroNote.id), retroNote).catch(
				console.error,
			),
		[retroCollection],
	);

	const addRetroNote = (index: number) =>
		addDoc(retroCollection, {
			date,
			index,
			type: 'retro',
			period,
			retronote: '',
		} as RetroNote);

	const isLoading = status === 'loading';
	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<section aria-label="Retro Notes">
			<h2>Retro Notes</h2>
			<ul className="list-inside list-none space-y-8 pl-0 text-gray-500 dark:text-gray-400">
				{retroNotes.map(retroNote => (
					<li key={retroNote.id}>
						<RetroNote {...{ ...retroNote }} handleSave={saveRetroNote} />
					</li>
				))}
			</ul>
			<button
				onClick={() => addRetroNote(retroNotes.length)}
				type="button"
				className="block w-36 rounded-full bg-blue-900 bg-center py-3 text-center text-base font-normal text-white shadow-xl hover:bg-blue-950 focus:ring-4 focus:ring-blue-700 dark:focus:ring-blue-300 sm:w-72"
			>
				Add Retro Note
			</button>
		</section>
	);
}

function getIsoWeek(date: Date): string {
	const copy = new Date(date.getTime());
	copy.setUTCDate(copy.getUTCDate() + 4 - (copy.getUTCDay() || 7));
	const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
	const weekNo = Math.ceil(
		((copy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
	);
	const year = copy.getUTCFullYear();
	return `${year}-W${weekNo.toString().padStart(2, '0')}`;
}

function Page() {
	const router = useRouter();
	const { day } = router.query;
	const date = day === 'today' ? new Date() : new Date(day as string);
	const dateYyyyMmDd = date.toISOString().split('T')[0];
	// get the year and week number
	const dateYyyyWww = getIsoWeek(date);

	const addDay = (number: number) => {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + number);
		return newDate.toISOString().split('T')[0];
	};

	const dayString = date.toLocaleDateString(navigator.language, {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
	});

	return (
		<>
			<br />
			<main className="format m-auto max-w-xs p-3 sm:max-w-screen-md">
				<section>
					<h1>{dayString}</h1>
					<h1>{dateYyyyWww}</h1>
					<Link href={`/app/daily/${addDay(-1)}`}>Previous day</Link>
					<Link href={`/app/daily/${addDay(1)}`}>Next day</Link>
				</section>
				<Outcomes period="weekly" date={dateYyyyWww} />
				<Outcomes period="daily" date={dateYyyyMmDd} />
				<RetroNotes period="daily" date={dateYyyyMmDd} />
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
