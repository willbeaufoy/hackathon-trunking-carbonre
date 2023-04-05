import BumpUnauthorised from "@/components/bump-unauthorised";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { FormEventHandler, MouseEventHandler, useState } from "react";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";

const Note = ({ note, title, id }: { note: string, title: string, id: string }) => {
    const [modify, setModify] = useState(false);

    const auth = useAuth();
    const { uid } = auth.currentUser;
    const firestore = useFirestore();
    const notesCollection = collection(firestore, `users/${uid}/notes`);

    const handleModify: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        setModify(true);
    }

    const handleSaveSubmit = (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const note = event.target.note.value;
        setDoc(doc(notesCollection, id), { title, note }).catch(console.error)
        setModify(false);
    }

    const handleDelete = (event) => {
        event.preventDefault();
        deleteDoc(doc(notesCollection, id)).catch(console.error)
    }
    
    return (
        <>
            <li>

                {modify ? (
                    <form onSubmit={handleSaveSubmit}>
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
    const [creating, setCreating] = useState(false);
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
        setCreating(true);
    }

    const handleCreateSubmit = (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const note = event.target.note.value;
        addDoc(notesCollection, { title, note }).catch(console.error)
        setCreating(false);
    }

    return (
        <main>
            <h1>Notes</h1>
            <section>
                <button onClick={handleCreate}>Create</button>
            </section>
            <section>
                <ul>
                    {notes.map(({ note, title, id }) => <Note key={id} {...{ note, title, id }} />)}
                </ul>
            </section>
            {creating && (
                <form onSubmit={handleCreateSubmit}>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" required /><br /><br />
                    <label htmlFor="note">Note:</label>
                    <input type="text" id="note" name="note" required /><br /><br />
                    <button type="submit">Save</button>
                </form>
            )}
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