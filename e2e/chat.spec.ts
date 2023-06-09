import { expect, test } from '@playwright/test';
import { getRandomChars } from './helpers/tools';
import { deleteUser, signupAndLogin } from './helpers/user-management';

const clean = (title: string) => title.replace(/[^a-zA-Z0-9]/g, '_');
const toEmail = testInfo =>
	`${clean(testInfo.title)}-${getRandomChars()}@test.com`;

test.beforeEach(async ({ page }, testInfo) => {
	const myEmail = toEmail(testInfo);
	await testInfo.attach('email', { body: myEmail });

	await signupAndLogin(page, myEmail);
});

test.afterEach(async ({ page }, testInfo) => {
	await page.close();
	const myEmail = testInfo.attachments
		.find(({ name }) => name === 'email')
		.body.toString();

	await deleteUser(myEmail);
});

// create a playwright test
test('chat', async ({ page }) => {
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
});
