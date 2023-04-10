import { expect, test } from '@playwright/test';
import { getRandomChars } from './tools';
import { signupAndLogin } from './user-management';

// AS A user
// I WANT TO be able to create a 3 weekly outcomes
// SO THAT I can plan my week
test('create weekly outcomes', async ({ page }) => {
	const myEmail = `test-${getRandomChars()}@test.com`;
	const myPassword = 'password';

	await signupAndLogin(page, myEmail, myPassword);
	await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();

	// in the page, find the section that contains the weekly outcomes heading
	const weeklyOutcomesSection = page.getByRole('region', {
		name: 'Weekly Outcomes',
	});

	const weeklyOutcomesFixture = [
		{ hotSpot: 'Mind', weeklyOutcome: 'I am a Mind weekly outcome' },
		{ hotSpot: 'Body', weeklyOutcome: 'I am a Body weekly outcome' },
		{
			hotSpot: 'Relationships',
			weeklyOutcome: 'I am a Relationships weekly outcome',
		},
	];

	const weeklyOutcomes = await weeklyOutcomesSection
		.getByRole('listitem')
		.all();
	expect(weeklyOutcomes.length).toBe(3);
	expect(weeklyOutcomes.length).toBe(3);

	// for each of the thre weeklyOutcomesList, fill the hot spot and the weekly outcome using the data from the array and save
	for await (const [index, weeklyOutcome] of weeklyOutcomes.entries()) {
		await weeklyOutcome
			.getByRole('combobox', { name: 'Hot spot' })
			.selectOption(weeklyOutcomesFixture[index].hotSpot);
		await weeklyOutcome
			.getByPlaceholder('Enter your weekly outcome')
			.fill(weeklyOutcomesFixture[index].weeklyOutcome);
		await weeklyOutcome.getByRole('button', { name: 'Save' }).click();
	}

	// if I close the browser and come back to the page
	await page.reload();

	//I should see the weekly outcomes I just created
	const refreshedWeeklyOutcomesSection = page.getByRole('region', {
		name: 'Weekly Outcomes',
	});
	const refreshedWeeklyOutcomesList = await refreshedWeeklyOutcomesSection
		.getByRole('listitem')
		.all();
	expect(refreshedWeeklyOutcomesList.length).toBe(3);
	expect(refreshedWeeklyOutcomesList[0].textContent()).toContain(
		weeklyOutcomesFixture[0].weeklyOutcome,
	);
	expect(refreshedWeeklyOutcomesList[0].textContent()).toContain(
		weeklyOutcomesFixture[0].hotSpot,
	);
	expect(refreshedWeeklyOutcomesList[1].textContent()).toContain(
		weeklyOutcomesFixture[1].weeklyOutcome,
	);
	expect(refreshedWeeklyOutcomesList[1].textContent()).toContain(
		weeklyOutcomesFixture[1].hotSpot,
	);
	expect(refreshedWeeklyOutcomesList[2].textContent()).toContain(
		weeklyOutcomesFixture[2].weeklyOutcome,
	);
	expect(refreshedWeeklyOutcomesList[2].textContent()).toContain(
		weeklyOutcomesFixture[2].hotSpot,
	);
});

// AS A user
// I WANT TO be able to create a 3 daily outcomes
// SO THAT I can plan my day

// AS A user
// I WANT TO be able to create a few retro notes
// SO THAT I can save note on my day
