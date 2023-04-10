import { expect } from '@playwright/test';
import axios from 'axios';
import { setTimeout } from 'timers/promises';

export async function validateEmail(myEmail: string) {
	const resp = await axios.get(
		'http://localhost:9099/emulator/v1/projects/nextjs13-vercel/oobCodes',
	);
	const { oobLink } = resp.data.oobCodes.find(({ email }) => email === myEmail);
	await axios.get(oobLink);
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

export async function signupAndLogin(
	page,
	myEmail: string,
	myPassword: string,
) {
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
