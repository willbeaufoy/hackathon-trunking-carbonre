import { expect, test } from '@playwright/test';
import { getRandomChars } from './helpers/tools';
import { deleteUser, signupAndLogin } from './helpers/user-management';
import { setFlag } from './helpers/setFlag';

test.describe('when user is authorised', () => {
	test.beforeEach(async ({ page }, testInfo) => {
		const myEmail = `test-${getRandomChars()}@test.com`;
		testInfo.attach('email', { body: myEmail });

		await signupAndLogin(page, myEmail);
	});

	test.afterEach(async ({ page }, testInfo) => {
		if (process.env.SMOKE_TEST === 'true') {
			page.close();
			const myEmail = testInfo.attachments
				.find(({ name }) => name === 'email')
				.body.toString();

			await deleteUser(myEmail);
		}
	});

	test('can test new page', async ({ page }) => {
		await expect(
			page.getByRole('heading', { name: 'Weekly Outcomes' }),
		).toBeVisible();

		// await expect(
		// 	page.getByRole('link', { name: 'Another page' }),
		// ).not.toBeVisible();

		// await setFlag(page, 'another-page', 'true');
		await page.getByRole('link', { name: 'Another page' }).click();
		await expect(
			page.getByRole('heading', { name: 'Another page' }),
		).toBeVisible();

		const loremIpsum =
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
		const sender = page.getByRole('region', { name: 'Sender' });
		await sender.getByRole('textbox').fill(loremIpsum);
		await sender.getByRole('button', { name: 'Send' }).click();

		await expect(
			page.getByRole('region', { name: 'receiver' }).getByText(loremIpsum),
		).toBeVisible();
	});

	// test('cannot test new page', async ({ page }) => {
	// 	await page.goto('/app/another-page');
	// 	await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
	// });
});

test.describe('when user is not authorised', () => {
	test('cannot test new page', async ({ page }) => {
		await page.goto('/app/another-page');

		await expect(
			page.getByRole('heading', { name: 'Another page' }),
		).not.toBeVisible();

		await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
	});
});
