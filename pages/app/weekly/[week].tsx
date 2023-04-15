import BumpUnauthorised from '@/components/login/bump-unauthorised';
import Layout from '@/components/layout';
import { Outcomes } from '@/components/notes/Outcomes';
import { RetroNotes } from '@/components/notes/RetroNotes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dateToDayMonthDate, dateToYyyyWw } from '@/lib/date';
import { addDays, addWeeks, parseISO } from 'date-fns';

function Page() {
	const router = useRouter();
	const { week } = router.query;
	const weekString =
		week === 'thisWeek' ? dateToYyyyWw(new Date()) : (week as string);
	const startOfWeek = parseISO(weekString);
	const startOFWeekDisplay = dateToDayMonthDate(startOfWeek);
	const endOfWeek = addDays(startOfWeek, 6);
	const endOfWeekDisplay = dateToDayMonthDate(endOfWeek);
	const nextWeekString = dateToYyyyWw(addWeeks(startOfWeek, 1));
	const prevWeekString = dateToYyyyWw(addWeeks(startOfWeek, -1));

	return (
		<>
			<br />
			<main className="format m-auto max-w-xs p-3 sm:max-w-screen-md">
				<section>
					<div className="mb-8 flex items-center justify-between">
						<Link
							href={`/app/weekly/${prevWeekString}`}
							aria-label="Previous week"
						>
							Prev
						</Link>
						<div className="flex flex-col items-center justify-center">
							<h2 className="mb-3">{weekString}</h2>
							<p className="m-0">
								{startOFWeekDisplay} - {endOfWeekDisplay}
							</p>
						</div>
						<Link href={`/app/weekly/${nextWeekString}`} aria-label="Next week">
							Next
						</Link>
					</div>
				</section>
				{/* <Outcomes period="daily" date={dateYyyyMmDd} /> */}
				<Outcomes period="weekly" date={weekString} />
				<RetroNotes period="weekly" date={weekString} />
			</main>
		</>
	);
}

export default function WeeklyFocus() {
	return (
		<BumpUnauthorised>
			<Layout>
				<Page />
			</Layout>
		</BumpUnauthorised>
	);
}
