import { expect, test } from '@playwright/test';
import { deleteUser, signupAndLogin } from './helpers/user-management';
import { testInfoToEmail } from './helpers/tools';

test.beforeEach(async ({ page }, testInfo) => {
	const myEmail = testInfoToEmail(testInfo);
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
