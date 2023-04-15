import { NoteModel, useNotesCollection } from './NoteModel';

interface RetroNoteModel extends NoteModel {
	type: 'retro';
	period: string;
	note: string;
}

interface RetroNoteProps extends RetroNoteModel {
	handleSave: (retronote: RetroNoteModel) => void;
}

function RetroNote({ note, handleSave, ...rest }: RetroNoteProps) {
	const handleOnSubmit = event => {
		event.preventDefault();
		const note = event.target.elements.note.value;
		handleSave({ ...rest, note });
	};

	return (
		<form onSubmit={handleOnSubmit} className="space-y-2">
			<textarea
				className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				rows={3}
				name="note"
				placeholder="Enter your retro note"
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

export function RetroNotes({ period, date }: { period: string; date: string }) {
	const type = 'retro';
	const { data, status, saveNote } = useNotesCollection({
		type,
		period,
		date,
	});
	const retroNotes = data as RetroNoteModel[];

	const addRetroNote = (index: number) =>
		saveNote({
			id: `${date}-${index}-${type}`,
			date,
			index,
			type,
			period,
			note: '',
		});

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
						<RetroNote {...{ ...retroNote }} handleSave={saveNote} />
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
