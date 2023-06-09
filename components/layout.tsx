import Link from 'next/link';
import { useUser } from 'reactfire';
import { isFeatureSet } from './feature-flags';

export default function Layout({ children }) {
	const { data: user } = useUser();

	return (
		<>
			<nav>
				<ul>
					{user?.emailVerified ? (
						<>
							<li className="mb-2">Hello {user?.email}</li>
							<li className="mb-2">
								<Link href="/chat">Chat</Link>
							</li>
							{/* )} */}
							<li className="mb-2">
								<Link href="/sign-out">Sign out</Link>
							</li>
						</>
					) : (
						<>
							<li className="mb-2">
								<Link href="/sign-in">Sign in</Link>
							</li>
							<li className="mb-2">
								<Link href="/sign-up">Sign up</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
			{children}
		</>
	);
}
