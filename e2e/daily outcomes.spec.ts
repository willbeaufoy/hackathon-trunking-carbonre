import { expect, test } from '@playwright/test';
import {
	expectNoRetroNotesExisting,
	expectOutcomesToBeEmpty,
	expectOutcomesToBeFilled,
	expectRetroNotesToHaveBeenFilled,
	expectTitleIs,
	fillOutcomes,
	fillRetroNotes,
	withinList,
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

	{
		await expectTitleIs(page, 'Tue, Mar 15');
		const outcomes = withinList(page, 'Weekly Outcomes');
		await fillOutcomes(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.reload();

	{
		await expectTitleIs(page, 'Tue, Mar 15');
		const outcomes = withinList(page, 'Weekly Outcomes');
		await expectOutcomesToBeFilled(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Next day' }).click();

	{
		await expectTitleIs(page, 'Wed, Mar 16');
		const outcomes = withinList(page, 'Weekly Outcomes');
		await expectOutcomesToBeFilled(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Previous day' }).click();
	await page.getByRole('link', { name: 'Previous day' }).click();

	{
		await expectTitleIs(page, 'Mon, Mar 14');
		const outcomes = withinList(page, 'Weekly Outcomes');
		await expectOutcomesToBeFilled(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Previous day' }).click();
	{
		await expectTitleIs(page, 'Sun, Mar 13');
		const outcomes = withinList(page, 'Weekly Outcomes');
		await expectOutcomesToBeEmpty(outcomesFixture, outcomes);
	}
});

// AS A user
// I WANT TO be able to create a 3 daily outcomes
// SO THAT I can plan my day
test('create daily outcomes and persist them', async ({ page }) => {
	const outcomesFixture = [
		{ hotSpot: 'Emotions', outcome: 'I am a Emotions daily outcome' },
		{ hotSpot: 'Career', outcome: 'I am a Career daily outcome' },
		{ hotSpot: 'Fun', outcome: 'I am a Fun daily outcome' },
	];

	await expectTitleIs(page, 'Tue, Mar 15');

	{
		const outcomes = withinList(page, 'Daily Outcomes');
		await fillOutcomes(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.reload();

	{
		await expectTitleIs(page, 'Tue, Mar 15');
		const outcomes = withinList(page, 'Daily Outcomes');
		await expectOutcomesToBeFilled(outcomesFixture, outcomes);
		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Next day' }).click();

	{
		await expectTitleIs(page, 'Wed, Mar 16');
		const outcomes = withinList(page, 'Daily Outcomes');
		await expectOutcomesToBeEmpty(outcomesFixture, outcomes);
	}

	await page.getByRole('link', { name: 'Previous day' }).click();
	await page.getByRole('link', { name: 'Previous day' }).click();

	{
		await expectTitleIs(page, 'Mon, Mar 14');
		const outcomes = withinList(page, 'Daily Outcomes');
		await expectOutcomesToBeEmpty(outcomesFixture, outcomes);
	}
});

// AS A user
// I WANT TO be able to create a few retro notes
// SO THAT I can save note on my day
test('create daily retro notes and persist them', async ({ page }) => {
	await expectTitleIs(page, 'Tue, Mar 15');
	{
		const retroNotes = withinList(page, 'Retro Notes');
		expect(await retroNotes.all()).toHaveLength(0);
		const retroNotesSection = page.getByRole('region', { name: 'Retro Notes' });
		await fillRetroNotes(retroNotesSection, retroNotes);
		expect(await retroNotes.all()).toHaveLength(3);
	}

	await page.reload();

	{
		await expectTitleIs(page, 'Tue, Mar 15');
		const retroNotes = withinList(page, 'Retro Notes');
		await expectRetroNotesToHaveBeenFilled(retroNotes);
		expect(await retroNotes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Next day' }).click();
	{
		await expectTitleIs(page, 'Wed, Mar 16');
		const retroNotes = withinList(page, 'Retro Notes');
		await expectNoRetroNotesExisting(retroNotes);
	}

	await page.getByRole('link', { name: 'Previous day' }).click();
	await page.getByRole('link', { name: 'Previous day' }).click();
	{
		await expectTitleIs(page, 'Mon, Mar 14');
		const retroNotes = withinList(page, 'Retro Notes');
		await expectNoRetroNotesExisting(retroNotes);
	}
});
