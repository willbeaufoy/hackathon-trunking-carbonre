import { expect } from '@playwright/test';
import { setTimeout } from 'timers/promises';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
	credential: cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
	}),
});
const auth = getAuth(app);
const firestore = getFirestore(app);

async function retry<T extends () => any>(fn: T): Promise<ReturnType<T>> {
	return Promise.any([0, 100, 500].map(ms => setTimeout(ms).then(fn))).catch(
		err => {
			err.errors.forEach(console.error);
			throw err;
		},
	);
}

export async function validateEmail(myEmail: string) {
	const user = await retry(() => auth.getUserByEmail(myEmail));
	await auth.updateUser(user.uid, { emailVerified: true });
}

export async function deleteUser(myEmail: string) {
	const user = await retry(() => auth.getUserByEmail(myEmail));
	await auth.deleteUser(user.uid);
	const doc = firestore.doc(`users/${user.uid}/`);
	await firestore.recursiveDelete(doc);
}

export async function signup(page, myEmail: string, myPassword: string) {
	await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
	await page.getByPlaceholder('Email').fill(myEmail);
	await page.getByPlaceholder('Password').fill(myPassword);
	await page.getByRole('button', { name: 'Sign up' }).click();
}

export async function login(page, myEmail: string, myPassword: string) {
	await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
	await page.getByPlaceholder('Email').fill(myEmail);
	await page.getByPlaceholder('Password').fill(myPassword);
	await page.getByRole('button', { name: 'Login' }).click();
}

export async function signupAndLogin(page, myEmail: string) {
	const myPassword = 'password';

	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'ZenFocus' })).toBeVisible();

	//// sign up
	// now sign up
	await page.getByRole('link', { name: 'Sign up' }).click();
	await signup(page, myEmail, myPassword);

	// simulate click the verify email
	await setTimeout(100);
	await validateEmail(myEmail);

	//// log in
	await page.goto('/');
	await page.getByRole('link', { name: 'I already have an account' }).click();
	await login(page, myEmail, myPassword);
}
