// create a test that
// - goes to "another-another-page"
// - checks that the page title is "Another Another Page"
// - write a message in the sender input
// - checks that the message is displayed in the receiver input
import { expect, test } from '@playwright/test';

test('another-another-page', async ({ page }) => {
	await page.goto('another-another-page');
	// TODO
	// await expect(page).toHaveTitle('Another Another Page');
	// await page.getByRole('region', {name: 'Sender'}).getByRole('textbox').fill('Hello World');
	// await page.getByRole('region', {name: 'Sender'}).getByRole('button', {name: 'Send'}).click();
	// await expect(page.getByRole('region', {name: 'receiver'}).getByText('Hello World')).toBeVisible();
});
