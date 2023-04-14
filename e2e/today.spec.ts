import { expect, test } from '@playwright/test';
import { setTimeout } from 'timers/promises';
import { getRandomChars } from './tools';
import { signupAndLogin } from './user-management';

const fakeNow = new Date('March 15 2022 13:37:11').valueOf();

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
	await expect(
		page.getByRole('heading', { name: 'Tue, Mar 15' }),
	).toBeVisible();

	{
		const outcomes = await page
			.getByRole('region', { name: 'Weekly Outcomes' })
			.getByRole('listitem');

		for await (const [
			index,
			{ hotSpot, outcome },
		] of outcomesFixture.entries()) {
			await outcomes
				.nth(index)
				.getByRole('combobox', { name: 'Hot spot' })
				.selectOption(hotSpot);
			await outcomes
				.nth(index)
				.getByPlaceholder('Enter your outcome')
				.fill(outcome);
			await outcomes.nth(index).getByRole('button', { name: 'Save' }).click();
		}

		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.reload();

	{
		await expect(
			page.getByRole('heading', { name: 'Tue, Mar 15' }),
		).toBeVisible();

		const outcomes = page
			.getByRole('region', { name: 'Weekly Outcomes' })
			.getByRole('listitem');

		for await (const [
			index,
			{ hotSpot, outcome },
		] of outcomesFixture.entries()) {
			expect(
				await outcomes
					.nth(index)
					.getByRole('combobox', { name: 'Hot spot' })
					.inputValue(),
			).toEqual(hotSpot);

			expect(
				await outcomes
					.nth(index)
					.getByPlaceholder('Enter your outcome')
					.inputValue(),
			).toEqual(outcome);
		}

		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Next day' }).click();

	{
		await expect(
			page.getByRole('heading', { name: 'Wed, Mar 16' }),
		).toBeVisible();
		await setTimeout(50);

		const outcomes = page
			.getByRole('region', { name: 'Weekly Outcomes' })
			.getByRole('listitem');

		for await (const [
			index,
			{ hotSpot, outcome },
		] of outcomesFixture.entries()) {
			expect(
				await outcomes
					.nth(index)
					.getByRole('combobox', { name: 'Hot spot' })
					.inputValue(),
			).toEqual(hotSpot);

			expect(
				await outcomes
					.nth(index)
					.getByPlaceholder('Enter your outcome')
					.inputValue(),
			).toEqual(outcome);
		}

		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Previous day' }).click();
	await page.getByRole('link', { name: 'Previous day' }).click();

	{
		await expect(
			page.getByRole('heading', { name: 'Mon, Mar 14' }),
		).toBeVisible();
		await setTimeout(50);

		const outcomes = page
			.getByRole('region', { name: 'Weekly Outcomes' })
			.getByRole('listitem');

		for await (const [
			index,
			{ hotSpot, outcome },
		] of outcomesFixture.entries()) {
			expect(
				await outcomes
					.nth(index)
					.getByRole('combobox', { name: 'Hot spot' })
					.inputValue(),
			).toEqual(hotSpot);

			expect(
				await outcomes
					.nth(index)
					.getByPlaceholder('Enter your outcome')
					.inputValue(),
			).toEqual(outcome);
		}

		expect(await outcomes.all()).toHaveLength(3);
	}

	// go back one day
	await page.getByRole('link', { name: 'Previous day' }).click();

	{
		await expect(
			page.getByRole('heading', { name: 'Sun, Mar 13' }),
		).toBeVisible();
		await setTimeout(50);

		const outcomes = page
			.getByRole('region', { name: 'Daily Outcomes' })
			.getByRole('listitem');

		for await (const [index] of outcomesFixture.entries()) {
			expect(
				await outcomes
					.nth(index)
					.getByRole('combobox', { name: 'Hot spot' })
					.inputValue(),
			).toEqual('');

			expect(
				await outcomes
					.nth(index)
					.getByPlaceholder('Enter your outcome')
					.inputValue(),
			).toEqual('');
		}
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

	const myEmail = `test-${getRandomChars()}@test.com`;
	const myPassword = 'password';

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

	await signupAndLogin(page, myEmail, myPassword);
	await expect(
		page.getByRole('heading', { name: 'Tue, Mar 15' }),
	).toBeVisible();

	{
		const outcomes = await page
			.getByRole('region', { name: 'Daily Outcomes' })
			.getByRole('listitem');

		for await (const [
			index,
			{ hotSpot, outcome },
		] of outcomesFixture.entries()) {
			await outcomes
				.nth(index)
				.getByRole('combobox', { name: 'Hot spot' })
				.selectOption(hotSpot);
			await outcomes
				.nth(index)
				.getByPlaceholder('Enter your outcome')
				.fill(outcome);
			await outcomes.nth(index).getByRole('button', { name: 'Save' }).click();
		}

		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.reload();

	{
		await expect(
			page.getByRole('heading', { name: 'Tue, Mar 15' }),
		).toBeVisible();

		const outcomes = page
			.getByRole('region', { name: 'Daily Outcomes' })
			.getByRole('listitem');

		for await (const [
			index,
			{ hotSpot, outcome },
		] of outcomesFixture.entries()) {
			expect(
				await outcomes
					.nth(index)
					.getByRole('combobox', { name: 'Hot spot' })
					.inputValue(),
			).toEqual(hotSpot);

			expect(
				await outcomes
					.nth(index)
					.getByPlaceholder('Enter your outcome')
					.inputValue(),
			).toEqual(outcome);
		}

		expect(await outcomes.all()).toHaveLength(3);
	}

	await page.getByRole('link', { name: 'Next day' }).click();

	{
		await expect(
			page.getByRole('heading', { name: 'Tue, Mar 15' }),
		).toBeVisible();
		await setTimeout(50);

		const outcomes = page
			.getByRole('region', { name: 'Daily Outcomes' })
			.getByRole('listitem');

		for await (const [index] of outcomesFixture.entries()) {
			expect(
				await outcomes
					.nth(index)
					.getByRole('combobox', { name: 'Hot spot' })
					.inputValue(),
			).toEqual('');

			expect(
				await outcomes
					.nth(index)
					.getByPlaceholder('Enter your outcome')
					.inputValue(),
			).toEqual('');
		}
	}
});

// AS A user
// I WANT TO be able to create a few retro notes
// SO THAT I can save note on my day
test('create retro notes and persist them', async ({ page }) => {
	const myEmail = `test-${getRandomChars()}@test.com`;
	const myPassword = 'password';

	await signupAndLogin(page, myEmail, myPassword);
	await expect(
		page.getByRole('heading', { name: 'Tue, Mar 15' }),
	).toBeVisible();

	{
		const retroNotesSection = page.getByRole('region', { name: 'Retro Notes' });
		const retroNotes = retroNotesSection.getByRole('listitem');

		expect(await retroNotes.all()).toHaveLength(0);

		for await (const [index] of [...Array(3)].entries()) {
			await retroNotesSection
				.getByRole('button', { name: 'Add Retro Note' })
				.click();
			await retroNotes
				.nth(index)
				.getByPlaceholder('Enter your retro note')
				.fill(`I am a retro note ${index}`);
			await retroNotes.nth(index).getByRole('button', { name: 'Save' }).click();
		}
	}

	await page.reload();

	{
		await expect(
			page.getByRole('heading', { name: 'Tue, Mar 15' }),
		).toBeVisible();

		const retroNotes = page
			.getByRole('region', { name: 'Retro Notes' })
			.getByRole('listitem');

		for await (const [index] of [...Array(3)].entries()) {
			expect(
				await retroNotes
					.nth(index)
					.getByRole('textbox', { name: 'Retro Note' })
					.inputValue(),
			).toEqual(`I am a retro note ${index}`);
		}

		expect(await retroNotes.all()).toHaveLength(3);
	}
});
