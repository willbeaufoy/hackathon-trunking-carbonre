import { useEffect } from 'react';
import { NoteModel, useNotesCollection } from './NoteModel';

const HOTSPOTS = [
	'Mind',
	'Body',
	'Relationships',
	'Emotions',
	'Career',
	'Fun',
] as const;

interface OutcomeModel extends NoteModel {
	period: string;
	type: 'outcome';
	hotSpot: string;
	note: string;
}

interface OutcomeProps extends OutcomeModel {
	handleSave: (outcome: OutcomeModel) => void;
}

function Outcome({ hotSpot, note, handleSave, ...rest }: OutcomeProps) {
	const handleOnSubmit = event => {
		event.preventDefault();
		const hotSpot = event.target.elements.hotSpot.value;
		const note = event.target.elements.note.value;
		handleSave({ ...rest, hotSpot, note });
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
				name="note"
				placeholder="Enter your outcome"
				defaultValue={note || ''}
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

export function Outcomes({ period, date }: { period: string; date: string }) {
	const type = 'outcome';
	const { data, status, saveNote } = useNotesCollection({
		type,
		period,
		date,
	});
	const outcomes = data as OutcomeModel[];

	useEffect(() => {
		const isLoaded = status === 'success';
		const hasOutcomes = outcomes && outcomes.length > 0;
		if (!isLoaded || hasOutcomes) return;
		[...Array(3)].map((_, index) =>
			saveNote({
				id: `${date}-${index}-${type}`,
				date,
				index,
				type,
				period,
				hotSpot: '',
				note: '',
			}),
		);
	}, [date, outcomes, period, saveNote, status]);

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
						<Outcome {...{ ...outcome }} handleSave={saveNote} />
					</li>
				))}
			</ul>
		</section>
	);
}
