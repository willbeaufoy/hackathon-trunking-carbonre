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

test('chat with another browser', async ({
	page: alicePage,
	browser,
}, testInfo) => {
	// expect page has header Chat
	await expect(alicePage.getByRole('heading', { name: 'Chat' })).toBeVisible();

	// send a message
	await alicePage.getByPlaceholder('Message').fill('Hello world');
	await alicePage.getByRole('button', { name: 'Send' }).click();
	await expect(alicePage.getByText('Hello world')).toBeVisible();

	// open a new page with a different context
	const bobPage = await browser.newContext().then(c => c.newPage());

	// log in as Bob
	const bobEmail = testInfoToEmail(testInfo);
	await signupAndLogin(bobPage, bobEmail);

	await expect(bobPage.getByRole('heading', { name: 'Chat' })).toBeVisible();

	// delete Bob
	await bobPage.close();
	await deleteUser(bobEmail);
});
