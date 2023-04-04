import BumpUnauthorised from "@/components/bump-unauthorised";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useAuth, useFirestore, useFirestoreCollectionData } from "reactfire";

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

    function handleCreate() {
        setCreating(true);
    }

    function handleCreateSubmit(event) {
        event.preventDefault();
        const title = event.target.elements.title.value;
        const note = event.target.elements.note.value;
        addDoc(notesCollection, { title, note }).catch(console.error)
    }

    return (
        <main>
            <h1>Notes</h1>
            <section>
                <button onClick={handleCreate}>Create</button>
            </section>
            <section>
                <ul>
                    {notes.map(({ note, title, id }) => (
                        <>
                            <li key={id}>
                                <h3>{title}</h3>
                                <p>{note}</p>
                            </li>
                            <button type="button">Modify</button>
                        </>
                    ))}
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