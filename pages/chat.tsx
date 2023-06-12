import Layout from '@/components/layout';
import BumpUnauthorised from '@/components/login/bump-unauthorised';
import { addDoc, collection, orderBy, query } from 'firebase/firestore';
import { useAuth, useFirestore, useFirestoreCollectionData } from 'reactfire';

function Chat() {
	const firestore = useFirestore();
	const auth = useAuth();
	const { email } = auth.currentUser;
	const chatCollection = collection(firestore, `chat`);
	const chatQuery = query(chatCollection, orderBy('createdAt'));
	const { status, data: messages } = useFirestoreCollectionData(chatQuery, {
		idField: 'id',
	});

	if (status === 'loading') {
		return <>Loading</>;
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const messageInput = event.currentTarget.elements.namedItem(
			'message',
		) as HTMLInputElement;
		const message = messageInput.value.trim();
		if (message) {
			addDoc(chatCollection, {
				message,
				createdAt: new Date(),
				email,
			}).catch(console.error);
		}
	};

	return (
		<>
			<h1>Chat</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="message">Message</label>
				<input type="text" name="message" placeholder="Message" />
				<button type="submit">Send</button>
			</form>

			<ul>
				{messages.map(({ id, createdAt, message, email }: any) => (
					<li key={id}>
						({createdAt.toDate().toISOString()}): {email} -&gt; {message}
					</li>
				))}
			</ul>
		</>
	);
}

export default function Page() {
	return (
		<BumpUnauthorised>
			<Layout>
				<Chat />
			</Layout>
		</BumpUnauthorised>
	);
}
