import CheckNotSignedIn from '@/components/check-not-signed-in';
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	sendEmailVerification,
	signInWithPopup,
} from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from 'reactfire';

const googleAuthProvider = new GoogleAuthProvider();

export function MySignup() {
	const auth = useAuth();
	const router = useRouter();

	function handleFormSubmit(event) {
		event.preventDefault();
		const email = event.target.elements.email.value;
		const password = event.target.elements.password.value;
		createUserWithEmailAndPassword(auth, email, password).then(async user => {
			await sendEmailVerification(user.user);
			router.push('/validate-email');
		});
	}

	const handleContinueWithGoogle = () =>
		signInWithPopup(auth, googleAuthProvider);

	return (
		<main className="mx-auto flex h-screen w-screen max-w-xs flex-col items-center bg-white text-center dark:bg-gray-900 sm:max-w-screen-md">
			<h3 className="mb-8 mt-4">Sign up</h3>
			<form
				onSubmit={handleFormSubmit}
				className="flex flex-1 flex-col space-y-8"
			>
				<input
					type="email"
					id="email"
					aria-label="Email"
					className="block h-10 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
					placeholder="Email"
				/>
				<input
					type="password"
					id="password"
					aria-label="Password"
					className="block h-10 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
					placeholder="Password"
				/>
				<button
					type="submit"
					className="w-72 rounded-full bg-green-300 py-3 text-center text-base font-normal text-black shadow-xl hover:bg-green-400 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 sm:w-96"
				>
					Sign up
				</button>
			</form>

			<section className="flex flex-1 flex-col space-y-8">
				<button
					type="button"
					onClick={handleContinueWithGoogle}
					className="dark:focus:ring-[#4285F4]/55 inline-flex w-72 items-center rounded-full bg-[#4285F4] p-6 py-3 text-center text-base font-normal text-white shadow-xl hover:bg-[#4285F4]/90 hover:bg-green-400 
        focus:outline-none focus:ring-4  focus:ring-[#4285F4]/50 focus:ring-green-200 dark:focus:ring-green-900 sm:w-96"
				>
					<svg
						className="h-5 w-5"
						aria-hidden="true"
						focusable="false"
						data-prefix="fab"
						data-icon="google"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 488 512"
					>
						<path
							fill="currentColor"
							d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
						></path>
					</svg>
					<span className="flex-1">Sign in with Google</span>
				</button>
				<Link href="/sign-in" className="text-base underline">
					I already have an account
				</Link>
				<Link href="/" className="text-base underline">
					Back home
				</Link>
			</section>
		</main>
	);
}

export default function Signup() {
	return (
		<CheckNotSignedIn>
			<MySignup />
		</CheckNotSignedIn>
	);
}
