import Layout from '@/components/layout';
import BumpUnauthorised from '@/components/login/bump-unauthorised';

import { useState } from 'react';

function Chat() {
	const [messages, setMessages] = useState<string[]>([]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const messageInput = event.currentTarget.elements.namedItem(
			'message',
		) as HTMLInputElement;
		const message = messageInput.value.trim();
		if (message) {
			setMessages(prevMessages => [...prevMessages, message]);
			messageInput.value = '';
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
				{messages.map((message, index) => (
					<li key={index}>{message}</li>
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
