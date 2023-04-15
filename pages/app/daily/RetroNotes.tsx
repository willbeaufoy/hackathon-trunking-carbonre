import {
	addDoc,
	collection,
	doc,
	orderBy,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { useCallback } from 'react';
import { useAuth, useFirestore, useFirestoreCollectionData } from 'reactfire';

const idField = 'id';

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

export function RetroNotes({ period, date }: { period: string; date: string }) {
	const firestore = useFirestore();
	const auth = useAuth();
	const { uid } = auth.currentUser;
	const retroCollection = collection(firestore, `users/${uid}/notes/`);
	const retroQuery = query(
		retroCollection,
		where('type', '==', 'retro'),
		where('period', '==', period),
		where('date', '==', date),
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
