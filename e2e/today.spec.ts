import { expect, test } from '@playwright/test';
import { getRandomChars } from './tools';
import { signupAndLogin } from './user-management';

// AS A user
// I WANT TO be able to create a 3 weekly outcomes
// SO THAT I can plan my week
test('create weekly outcomes and persist them', async ({ page }) => {
	const outcomesFixture = [
		{ hotSpot: 'Mind', outcome: 'I am a Mind weekly outcome' },
		{ hotSpot: 'Body', outcome: 'I am a Body weekly outcome' },
		{
			hotSpot: 'Relationships',
			outcome: 'I am a Relationships weekly outcome',
		},
	];

	const myEmail = `test-${getRandomChars()}@test.com`;
	const myPassword = 'password';

	await signupAndLogin(page, myEmail, myPassword);
	await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();

	{
		const outcomes = await page
			.getByRole('region', { name: 'Weekly Outcomes' })
			.getByRole('listitem')
			.all();
		expect(outcomes.length).toBe(3);

		for await (const [index, outcome] of outcomes.entries()) {
			await outcome
				.getByRole('combobox', { name: 'Hot spot' })
				.selectOption(outcomesFixture[index].hotSpot);
			await outcome
				.getByPlaceholder('Enter your weekly outcome')
				.fill(outcomesFixture[index].outcome);
			await outcome.getByRole('button', { name: 'Save' }).click();
		}
	}

	await page.reload();

	{
		const outcomes = await page
			.getByRole('region', { name: 'Weekly Outcomes' })
			.getByRole('listitem')
			.all();
		expect(outcomes.length).toBe(3);

		for await (const [index, outcome] of outcomes.entries()) {
			expect(
				await outcome.getByRole('combobox', { name: 'Hot spot' }).inputValue(),
			).toEqual(outcomesFixture[index].hotSpot);

			expect(
				await outcome
					.getByPlaceholder('Enter your weekly outcome')
					.inputValue(),
			).toEqual(outcomesFixture[index].outcome);
		}
	}
});

// AS A user
// I WANT TO be able to create a 3 daily outcomes
// SO THAT I can plan my day

// AS A user
// I WANT TO be able to create a few retro notes
// SO THAT I can save note on my day
