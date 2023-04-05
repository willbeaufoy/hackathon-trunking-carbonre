import BumpUnauthorised from "@/components/bump-unauthorised";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";

interface NoteProps {
    id: string;
    note: string;
    title: string;
    draft?: {
        note: string;
        title: string
    }
  }

const Note = ({ id, note, title, draft }: NoteProps) => {
    const firestore = useFirestore();
    const auth = useAuth();
    const { uid } = auth.currentUser;
    const notesCollection = collection(firestore, `users/${uid}/notes`);

    const handleModify = () => {
        setDoc(doc(notesCollection, id), { title, note, draft: {title, note}})
    }

    const handleSave = (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const note = event.target.note.value;
        setDoc(doc(notesCollection, id), { title, note })
            .catch(console.error)
    }

    const handleDelete = (event) => {
        event.preventDefault();
        deleteDoc(doc(notesCollection, id)).catch(console.error)
    }


    return (
        <>
            <li>
                {draft ? (
                    <form onSubmit={handleSave}>
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" required defaultValue={title} /><br /><br />
                        <label htmlFor="note">Note:</label>
                        <input type="text" id="note" name="note" required defaultValue={note} /><br /><br />
                        <button type="submit">Save</button>
                    </form>
                ) : (
                    <>
                        <h3>{title}</h3>
                        <p>{note}</p>
                        <button type="button" onClick={handleModify}>Modify</button>
                        <button type="button" onClick={handleDelete}>Delete</button>
                    </>
                )}
            </li>
        </>
    )
}

function MyNotes() {
    const firestore = useFirestore();
    const auth = useAuth();
    const { uid } = auth.currentUser;
    const notesCollection = collection(firestore, `users/${uid}/notes`);
    const { status, data: notes } = useFirestoreCollectionData(notesCollection, {
        idField: 'id',
    })

    if (status === 'loading') {
        return <>Loading</>;
    }

    const handleCreate = () => {
        addDoc(notesCollection, {title: '', note: '', draft: {title: '', note: ''}})
            .catch(console.error)
    }

    return (
        <main>
            <h1>Notes</h1>
            <section>
                <button onClick={handleCreate}>Create</button>
            </section>
            <section>
                <ul>
                    {notes.map((note: any) => 
                        <Note 
                            key={note.id} 
                            {...note} 
                        />
                    )}
                </ul>
            </section>
        </main>
    )
}

export default function Notes() {
    return (
        <BumpUnauthorised>
            <MyNotes />
        </BumpUnauthorised>
    );
};