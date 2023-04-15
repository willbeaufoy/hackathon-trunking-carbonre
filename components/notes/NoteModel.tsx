import {
	collection,
	doc,
	orderBy,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { useAuth, useFirestore, useFirestoreCollectionData } from 'reactfire';

export interface NoteModel {
	id: string;
	index: number;
	date: string;
	type: string;
	note: string;
}
const idField = 'id';

export const useNotesCollection = ({
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
	const noteCollection = collection(firestore, `users/${uid}/notes/`);
	const noteQuery = query(
		noteCollection,
		where('type', '==', type),
		where('period', '==', period),
		where('date', '==', date),
		orderBy('index', 'asc'),
	);
	const { status, data } = useFirestoreCollectionData(noteQuery, {
		idField,
	});

	const saveNote = <T extends NoteModel>(note: T) =>
		setDoc(doc(noteCollection, note.id), note).catch(console.error);

	return { data, status, saveNote };
};
