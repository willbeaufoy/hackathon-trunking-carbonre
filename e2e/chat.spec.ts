import { expect, test } from '@playwright/test';
import { getRandomChars } from './helpers/tools';
import { deleteUser, validateEmail } from './helpers/user-management';

const clean = (title: string) => title.replace(/[^a-zA-Z0-9]/g, '_');
const toEmail = testInfo =>
	`${clean(testInfo.title)}-${getRandomChars()}@test.com`;

// create a playwright test
test('chat', async ({ page }, testInfo) => {
	// open the page
	await page.goto('/');
	// sign up
	await page.getByText('Sign up').click();
	// fill email / password
	const myEmail = toEmail(testInfo);
	await page.getByPlaceholder('Email').fill(myEmail);
	await page.getByPlaceholder('Password').fill('myPassword');
	// click the button
	await page.getByRole('button', { name: 'Sign up' }).click();
	// expect page has header Validate email
	await expect(
		page.getByRole('heading', { name: 'Validate email' }),
	).toBeVisible();

	await validateEmail(myEmail);

	await page.goto('/');
	// sign in
	await page.getByText('I already have an account').click();
	// fill email / password
	await page.getByPlaceholder('Email').fill(myEmail);
	await page.getByPlaceholder('Password').fill('myPassword');
	// click the button
	await page.getByRole('button', { name: 'Login' }).click();
	// expect page has header Chat
	await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();

	// send a message
	await page.getByPlaceholder('Message').fill('Hello world');
	await page.getByRole('button', { name: 'Send' }).click();
	await expect(page.getByText('Hello world')).toBeVisible();

	// send another one
	await page.getByPlaceholder('Message').fill('My second message');
	await page.getByRole('button', { name: 'Send' }).click();
	await expect(page.getByText('My second message')).toBeVisible();

	// delete the user
	await deleteUser(myEmail);
});
