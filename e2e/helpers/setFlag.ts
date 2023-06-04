import { Page } from '@playwright/test';

export async function setFlag(
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
