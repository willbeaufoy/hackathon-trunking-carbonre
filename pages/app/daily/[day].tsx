import BumpUnauthorised from '@/components/login/bump-unauthorised';
import Layout from '@/components/layout';
import { Outcomes } from '@/components/notes/Outcomes';
import { RetroNotes } from '@/components/notes/RetroNotes';
import Link from 'next/link';
import { useRouter } from 'next/router';

function getIsoWeek(date: Date): string {
	const copy = new Date(date.getTime());
	copy.setUTCDate(copy.getUTCDate() + 4 - (copy.getUTCDay() || 7));
	const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
	const weekNo = Math.ceil(
		((copy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
	);
	const year = copy.getUTCFullYear();
	return `${year}-W${weekNo.toString().padStart(2, '0')}`;
}

function Page() {
	const router = useRouter();
	const { day } = router.query;
	const date = day === 'today' ? new Date() : new Date(day as string);
	const dateYyyyMmDd = date.toISOString().split('T')[0];
	const dateYyyyWww = getIsoWeek(date);

	const addDay = (number: number) => {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + number);
		return newDate.toISOString().split('T')[0];
	};

	const dayString = date.toLocaleDateString(navigator.language, {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
	});

	return (
		<>
			<br />
			<main className="format m-auto max-w-xs p-3 sm:max-w-screen-md">
				<section>
					<div className="mb-8 flex items-center justify-between">
						<Link href={`/app/daily/${addDay(-1)}`} aria-label="Previous day">
							Prev
						</Link>
						<div className="flex flex-col items-center justify-center">
							<h2 className="mb-3">{dayString}</h2>
							<p className="m-0">{dateYyyyWww}</p>
						</div>
						<Link href={`/app/daily/${addDay(1)}`} aria-label="Next day">
							Next
						</Link>
					</div>
				</section>
				<Outcomes period="weekly" date={dateYyyyWww} />
				<Outcomes period="daily" date={dateYyyyMmDd} />
				<RetroNotes period="daily" date={dateYyyyMmDd} />
			</main>
		</>
	);
}

export default function DailyFocus() {
	return (
		<BumpUnauthorised>
			<Layout>
				<Page />
			</Layout>
		</BumpUnauthorised>
	);
}
