import {
	collection,
	doc,
	orderBy,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { useEffect } from 'react';
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

interface OutcomeModel {
	id: string;
	index: number;
	date: string;
	period: string;
	type: string;
	hotSpot: string;
	outcome: string;
}

interface OutcomeProps extends OutcomeModel {
	handleSave: (outcome: OutcomeModel) => void;
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

const useNotesCollection = ({
	type,
	period,
	date,
}: {
	type: string;
	period: string;
	date: string;
}) => {
	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const outcomesCollection = collection(firestore, `users/${uid}/notes/`);
	const outcomesQuery = query(
		outcomesCollection,
		where('type', '==', type),
		where('period', '==', period),
		where('date', '==', date),
		orderBy('index', 'asc'),
	);
	const { status, data } = useFirestoreCollectionData(outcomesQuery, {
		idField,
	});
	const outcomes = data as OutcomeModel[];

	const getOutcomeId = ({ date, index }: OutcomeModel) => `${date}-${index}`;
	const saveOutcome = (outcome: OutcomeModel) =>
		setDoc(doc(outcomesCollection, getOutcomeId(outcome)), outcome).catch(
			console.error,
		);

	return { outcomes, status, saveOutcome };
};

export function Outcomes({ period, date }: { period: string; date: string }) {
	const type = 'outcome';
	const { outcomes, status, saveOutcome } = useNotesCollection({
		type,
		period,
		date,
	});

	useEffect(() => {
		const isLoaded = status === 'success';
		const hasOutcomes = outcomes && outcomes.length > 0;
		if (!isLoaded || hasOutcomes) return;
		[...Array(3)].map((_, index) =>
			saveOutcome({
				id: `${date}-${index}`,
				date,
				index,
				type: 'outcome',
				period,
				hotSpot: '',
				outcome: '',
			}),
		);
	}, [date, outcomes, period, saveOutcome, status]);

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
