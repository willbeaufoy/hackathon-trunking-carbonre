import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
	return (
		<main className="mx-auto flex min-h-full w-full max-w-xs flex-col items-center justify-evenly bg-white text-center dark:bg-gray-900 sm:max-w-screen-md">
			<div className="relative h-32 w-32 md:h-48 md:w-48">
				<Image src="/logo.png" alt="logo" fill />
			</div>
			<section className="after:content-['\a0']">
				<h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
					ZenFocus
				</h1>
				<p className="text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-xl">
					DAJE NANTAS
				</p>
			</section>
			<Link
				href="/sign-up"
				className="block w-72 rounded-full bg-green-300 py-3 text-center text-base font-normal text-black shadow-xl hover:bg-green-400 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 sm:w-96"
			>
				Sign up
			</Link>
			<Link
				href="/sign-in"
				className="text-base underline after:content-['\a0']"
			>
				I already have an account
			</Link>
		</main>
	);
}
