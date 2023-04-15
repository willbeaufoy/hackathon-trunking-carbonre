import { expect, Locator, Page, test } from '@playwright/test';
import { setTimeout } from 'timers/promises';
import { getRandomChars } from './tools';
import { signupAndLogin } from './user-management';

const slowDownMs = 200;
const fakeNow = new Date('March 15 2022 13:37:11').valueOf();

test.beforeEach(async ({ page }) => {
	await page.addInitScript(`{
		// Extend Date constructor to default to fakeNow
		Date = class extends Date {
		  constructor(...args) {
			if (args.length === 0) {
			  super(${fakeNow});
			} else {
			  super(...args);
			}
		  }
		}
		// Override Date.now() to start from fakeNow
		const __DateNowOffset = ${fakeNow} - Date.now();
		const __DateNow = Date.now;
		Date.now = () => __DateNow() + __DateNowOffset;
	  }`);

	const myEmail = `test-${getRandomChars()}@test.com`;
	const myPassword = 'password';

	await signupAndLogin(page, myEmail, myPassword);
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

	await page.getByRole('link', { name: 'Weekly' }).click();

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
test('create retro notes and persist them', async ({ page }) => {
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

const expectTitleIs = (page: Page, title: string) =>
	expect(page.getByRole('heading', { name: title })).toBeVisible();

const withinList = (page: Page, name: string) =>
	page.getByRole('region', { name }).getByRole('listitem');

const fillOutcomes = async (
	outcomesFixture: { hotSpot: string; outcome: string }[],
	outcomes: Locator,
) => {
	for await (const [index, { hotSpot, outcome }] of outcomesFixture.entries()) {
		await outcomes
			.nth(index)
			.getByRole('combobox', { name: 'Hot spot' })
			.selectOption(hotSpot);
		await outcomes
			.nth(index)
			.getByPlaceholder('Enter your outcome')
			.fill(outcome);
		await outcomes.nth(index).getByRole('button', { name: 'Save' }).click();
		await setTimeout(slowDownMs);
	}
	return;
};

const expectOutcomesToBeFilled = async (
	outcomesFixture: { hotSpot: string; outcome: string }[],
	outcomes,
) => {
	for await (const [index, { hotSpot, outcome }] of outcomesFixture.entries()) {
		await setTimeout(slowDownMs);
		await expect(
			outcomes.nth(index).getByRole('combobox', { name: 'Hot spot' }),
		).toHaveValue(hotSpot);

		await expect(
			outcomes.nth(index).getByPlaceholder('Enter your outcome'),
		).toHaveValue(outcome);
	}
	return;
};

const expectOutcomesToBeEmpty = async (
	outcomesFixture: { hotSpot: string; outcome: string }[],
	outcomes,
) => {
	for await (const [index] of outcomesFixture.entries()) {
		await setTimeout(slowDownMs);
		await expect(
			outcomes.nth(index).getByRole('combobox', { name: 'Hot spot' }),
		).toHaveValue('');

		await expect(
			outcomes.nth(index).getByPlaceholder('Enter your outcome'),
		).toHaveValue('');
	}
	return;
};

const fillRetroNotes = async (
	retroNotesSection: Locator,
	retroNotes: Locator,
) => {
	for await (const [index] of [...Array(3)].entries()) {
		await retroNotesSection
			.getByRole('button', { name: 'Add Retro Note' })
			.click();
		await setTimeout(slowDownMs);
		await retroNotes
			.nth(index)
			.getByPlaceholder('Enter your retro note')
			.fill(`I am a retro note ${index}`);
		await retroNotes.nth(index).getByRole('button', { name: 'Save' }).click();
	}
	return;
};

const expectRetroNotesToHaveBeenFilled = async (retroNotes: Locator) => {
	for await (const [index] of [...Array(3)].entries()) {
		await expect(
			retroNotes.nth(index).getByRole('textbox', { name: 'Retro Note' }),
		).toHaveValue(`I am a retro note ${index}`);
	}
	return;
};

const expectNoRetroNotesExisting = (retroNotes: Locator) =>
	expect(
		retroNotes.first().getByRole('textbox', { name: 'Retro Note' }),
	).not.toBeVisible();
