import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from 'reactfire';

export default function ValidateEmail() {
	const auth = useAuth();

	useEffect(() => {
		auth.signOut();
	}, [auth]);

	return (
		<main>
			<h1>Validate email</h1>
			<section>
				<ul>
					<li>
						<Link href="/sign-in">Sign in</Link>
					</li>
					<li>
						<Link href="/">Home</Link>
					</li>
				</ul>
			</section>
		</main>
	);
}
