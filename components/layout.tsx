import Link from 'next/link';
import { useUser } from 'reactfire';

export default function Layout({ children }) {
	const { data: user } = useUser();

	return (
		<>
			<nav>
				<ul>
					{user?.emailVerified ? (
						<>
							<li>Hello {user?.email}</li>
							<li>
								<Link href="/notes">Notes</Link>
							</li>
							<li>
								<Link href="/app/weekly/thisWeek">Weekly</Link>
							</li>
							<li>
								<Link href="/sign-out">Sign out</Link>
							</li>
						</>
					) : (
						<>
							<li>
								<Link href="/sign-in">Sign in</Link>
							</li>
							<li>
								<Link href="/sign-up">Sign uppppp</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
			{children}
		</>
	);
}
