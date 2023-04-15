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
							<li className="mb-2">Hello {user?.email}</li>
							<li className="mb-2">
								<Link href="/notes">Notes</Link>
							</li>
							<li className="mb-2">
								<Link href="/app/daily/today">Today</Link>
							</li>
							<li className="mb-2">
								<Link href="/app/weekly/thisWeek">This week</Link>
							</li>
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
