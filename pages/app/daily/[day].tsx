import Layout from '@/components/layout';
import { useRouter } from 'next/router';

function WeeklyOutcome() {
	// how to use reactfire to get an element out of a collection?

	return (
		<form onSubmit={e => e.preventDefault()}>
			<select aria-label="Hot spot">
				<option value="" disabled selected>
					Select a hot spot
				</option>
				<option value="mind">Mind</option>
				<option value="body">Body</option>
				<option value="relationships">Relationships</option>
			</select>
			<input type="text" placeholder="Enter your Weekly outcome" />
			<button type="submit">Save</button>
		</form>
	);
}

export default function DailyFocus() {
	const router = useRouter();
	const { day } = router.query;

	return (
		<Layout>
			<br />
			<main className="format mx-auto max-w-xs sm:max-w-screen-md">
				<section>
					<h1>{day}</h1>
					<h2>Sat 8th Apr</h2>
				</section>
				<section aria-label="Weekly Outcomes">
					<h2>Weekly Outcomes</h2>
					<ul>
						<li>
							<WeeklyOutcome />
						</li>
						<li>
							<WeeklyOutcome />
						</li>
						<li>
							<WeeklyOutcome />
						</li>
					</ul>
				</section>
				<section>
					<h2>Daily Outcomes</h2>
					<ul>
						<li>
							<input
								type="text"
								id="email"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Enter your Daily outcome"
								defaultValue="Daily outcome 1"
							/>
						</li>
						<li>
							<input
								type="text"
								id="email"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Enter your Daily outcome"
								defaultValue="Daily outcome 2"
							/>
						</li>
						<li>
							<input
								type="text"
								id="email"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Enter your Daily outcome"
							/>
						</li>
					</ul>
				</section>
				<section>
					<h2>Retro</h2>
					<ul>
						<li>
							<input
								type="text"
								id="email"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Enter your Retro"
								defaultValue="Retro 1"
							/>
						</li>
						<li>
							<input
								type="text"
								id="email"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Enter your Retro"
								defaultValue="Retro 2"
							/>
						</li>
						<li>
							<input
								type="text"
								id="email"
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Enter your Retro"
							/>
						</li>
					</ul>
				</section>
			</main>
		</Layout>
	);
}
