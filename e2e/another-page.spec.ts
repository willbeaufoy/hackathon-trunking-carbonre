import { Page, expect, test } from '@playwright/test';
import { getRandomChars } from './helpers/tools';
import { deleteUser, signupAndLogin } from './helpers/user-management';
import { setTimeout } from 'timers/promises';

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

async function setFlag(
	page: Page,
	flagName: string,
	value: string,
): Promise<void> {
	await page.evaluate(
		([flagName, value]) => {
			localStorage.setItem(`feature-${flagName}`, value);
		},
		[flagName, value],
	);
	await page.reload();
	return;
}

test('can test new page', async ({ page }) => {
	await expect(
		page.getByRole('heading', { name: 'Weekly Outcomes' }),
	).toBeVisible();

	await expect(
		page.getByRole('link', { name: 'Another page' }),
	).not.toBeVisible();
	await setFlag(page, 'another-page', 'true');

	await page.getByRole('link', { name: 'Another page' }).click();
	await expect(
		page.getByRole('heading', { name: 'Another page' }),
	).toBeVisible();

	// WIP
	// // in the section "sender", enter "test" in the input and press "Send"
	// await page.getByRole('region', { name: 'sender' }).getByRole('textbox').fill('test');
	// await page.getByRole('region', { name: 'sender' }).getByRole('button', { name: 'Send' }).click();

	// // in the section "receiver", check that the text "test" is visible
	// await expect(page.getByRole('region', { name: 'receiver' }).getByText('test')).toBeVisible();
});
