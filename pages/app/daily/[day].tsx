import Layout from '@/components/layout';
import BumpUnauthorised from '@/components/login/bump-unauthorised';
import { Outcomes } from '@/components/notes/Outcomes';
import { RetroNotes } from '@/components/notes/RetroNotes';
import { dateToYyyyMmDd, dateToYyyyWw, dateToDayMonthDate } from '@/lib/date';
import { addDays } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Page() {
	const router = useRouter();
	const { day } = router.query;
	const date = day === 'today' ? new Date() : new Date(day as string);
	const dateYyyyMmDd = dateToYyyyMmDd(date);
	const dateYyyyWw = dateToYyyyWw(date);
	const dayString = dateToDayMonthDate(date);

	return (
		<>
			<br />
			<main className="format m-auto max-w-xs p-3 sm:max-w-screen-md">
				<section>
					<div className="mb-8 flex items-center justify-between">
						<Link
							href={`/app/daily/${dateToYyyyMmDd(addDays(date, -1))}`}
							aria-label="Previous day"
						>
							Prev
						</Link>
						<div className="flex flex-col items-center justify-center">
							<h2 className="mb-3">{dayString}</h2>
							<p className="m-0">{dateYyyyWw}</p>
						</div>
						<Link
							href={`/app/daily/${dateToYyyyMmDd(addDays(date, 1))}`}
							aria-label="Next day"
						>
							Next
						</Link>
					</div>
				</section>
				<Outcomes period="weekly" date={dateYyyyWw} />
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
