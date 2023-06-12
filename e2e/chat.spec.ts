import { expect, test } from '@playwright/test';
import { deleteUser, signupAndLogin } from './helpers/user-management';
import { testInfoToEmail } from './helpers/tools';

test.beforeEach(async ({ page }, testInfo) => {
	const myEmail = testInfoToEmail(testInfo);
	await testInfo.attach('email', { body: myEmail });

	await signupAndLogin(page, myEmail);

	await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
});

test.afterEach(async ({ page }, testInfo) => {
	await page.close();
	const myEmail = testInfo.attachments
		.find(({ name }) => name === 'email')
		.body.toString();

	await deleteUser(myEmail);
});

test('chat', async ({ page }) => {
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
	// log in Bob
	const bobPage = await browser.newContext().then(c => c.newPage());
	const bobEmail = testInfoToEmail(testInfo);
	await signupAndLogin(bobPage, bobEmail);
	await expect(bobPage.getByRole('heading', { name: 'Chat' })).toBeVisible();

	// delete Bob
	await bobPage.close();
	await deleteUser(bobEmail);
});
