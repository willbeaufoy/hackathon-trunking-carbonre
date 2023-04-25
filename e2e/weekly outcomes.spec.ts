import { expect, test } from '@playwright/test';
import {
	expectTitleIs,
	withinList,
	fillOutcomes,
	expectOutcomesToBeFilled,
	expectOutcomesToBeEmpty,
	fillRetroNotes,
	expectRetroNotesToHaveBeenFilled,
	expectNoRetroNotesExisting,
} from './helpers/outcome';
import { getRandomChars, mockDate } from './helpers/tools';
import { deleteUser, signupAndLogin } from './helpers/user-management';

const fakeNow = new Date('March 15 2022 13:37:11').valueOf();

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(mockDate(fakeNow));

	const myEmail = `test-${getRandomChars()}@test.com`;
	testInfo.attach('email', { body: myEmail });

	await signupAndLogin(page, myEmail);
});

test.afterEach(async ({ page }, testInfo) => {
	page.close();
	const myEmail = testInfo.attachments
		.find(({ name }) => name === 'email')
		.body.toString();

	await deleteUser(myEmail);
});

// AS A user
// I WANT TO be able to manage my weekly outcomes
// SO THAT I can plan my month
test('manage many weekly outcomes', async ({ page }) => {
	const outcomesFixture = [
		{ hotSpot: 'Mind', outcome: 'I am a Mind weekly outcome' },
		{ hotSpot: 'Body', outcome: 'I am a Body weekly outcome' },
		{
			hotSpot: 'Relationships',
			outcome: 'I am a Relationships weekly outcome',
		},
	];

	{
		await expectTitleIs(page, 'Tue, Mar 15');
		const outcomes = withinList(page, 'Weekly Outcomes');
		await fillOutcomes(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'This week' }).click();

	{
		await expectTitleIs(page, '2022-W11');
		expect(page.getByText('Mon, Mar 14 - Sun, Mar 20')).toBeVisible();
		const outcomes = withinList(page, 'Weekly Outcomes');
		await expectOutcomesToBeFilled(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Next week' }).click();
	{
		await expectTitleIs(page, '2022-W12');
		const outcomes = withinList(page, 'Weekly Outcomes');
		await expectOutcomesToBeEmpty(outcomesFixture, outcomes);
	}

	await page.getByRole('link', { name: 'Previous week' }).click();
	await page.getByRole('link', { name: 'Previous week' }).click();

	{
		await expectTitleIs(page, '2022-W10');
		const outcomes = withinList(page, 'Weekly Outcomes');
		await expectOutcomesToBeEmpty(outcomesFixture, outcomes);
	}
});

// AS A user
// I WANT TO be able to create a 3 monthly outcomes
// SO THAT I can plan my month
test('create monthly outcomes and persist them', async ({ page }) => {
	const outcomesFixture = [
		{ hotSpot: 'Emotions', outcome: 'I am a Emotions monthly outcome' },
		{ hotSpot: 'Career', outcome: 'I am a Career monthly outcome' },
		{ hotSpot: 'Fun', outcome: 'I am a Fun monthly outcome' },
	];

	await expectTitleIs(page, 'Tue, Mar 15');
	await page.getByRole('link', { name: 'This week' }).click();

	{
		await expectTitleIs(page, '2022-W11');
		const outcomes = withinList(page, 'Monthly Outcomes');
		await fillOutcomes(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.reload();

	{
		await expectTitleIs(page, '2022-W11');
		const outcomes = withinList(page, 'Monthly Outcomes');
		await expectOutcomesToBeFilled(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Next week' }).click();

	{
		await expectTitleIs(page, '2022-W12');
		const outcomes = withinList(page, 'Monthly Outcomes');
		await expectOutcomesToBeFilled(outcomesFixture, outcomes);
	}

	await page.getByRole('link', { name: 'Previous week' }).click();
	await page.getByRole('link', { name: 'Previous week' }).click();
	await page.getByRole('link', { name: 'Previous week' }).click();

	{
		await expectTitleIs(page, '2022-W09');
		const outcomes = withinList(page, 'Monthly Outcomes');
		await expectOutcomesToBeEmpty(outcomesFixture, outcomes);
	}
});

// AS A user
// I WANT TO be able to create a few retro notes
// SO THAT I can save note on my week
test('create weekly retro notes and persist them', async ({ page }) => {
	await expectTitleIs(page, 'Tue, Mar 15');
	await page.getByRole('link', { name: 'This week' }).click();

	{
		await expectTitleIs(page, '2022-W11');
		const retroNotes = withinList(page, 'Retro Notes');
		expect(await retroNotes.all()).toHaveLength(0);
		const retroNotesSection = page.getByRole('region', { name: 'Retro Notes' });
		await fillRetroNotes(retroNotesSection, retroNotes);
		expect(await retroNotes.all()).toHaveLength(3);
	}

	await page.reload();

	{
		await expectTitleIs(page, '2022-W11');
		const retroNotes = withinList(page, 'Retro Notes');
		await expectRetroNotesToHaveBeenFilled(retroNotes);
		expect(await retroNotes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Next week' }).click();
	{
		await expectTitleIs(page, '2022-W12');
		const retroNotes = withinList(page, 'Retro Notes');
		await expectNoRetroNotesExisting(retroNotes);
	}

	await page.getByRole('link', { name: 'Previous week' }).click();
	await page.getByRole('link', { name: 'Previous week' }).click();
	{
		await expectTitleIs(page, '2022-W10');
		const retroNotes = withinList(page, 'Retro Notes');
		await expectNoRetroNotesExisting(retroNotes);
	}
});
