import { expect, Locator, Page } from '@playwright/test';
import { setTimeout } from 'timers/promises';

const slowDownMs = 200;

export const expectTitleIs = (page: Page, title: string) =>
	expect(page.getByRole('heading', { name: title })).toBeVisible();
export const withinList = (page: Page, name: string) =>
	page.getByRole('region', { name }).getByRole('listitem');
export const fillOutcomes = async (
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
export const expectOutcomesToBeFilled = async (
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
export const expectOutcomesToBeEmpty = async (
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
export const fillRetroNotes = async (
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
export const expectRetroNotesToHaveBeenFilled = async (retroNotes: Locator) => {
	for await (const [index] of [...Array(3)].entries()) {
		await expect(
			retroNotes.nth(index).getByRole('textbox', { name: 'Retro Note' }),
		).toHaveValue(`I am a retro note ${index}`);
	}
	return;
};
export const expectNoRetroNotesExisting = (retroNotes: Locator) =>
	expect(
		retroNotes.first().getByRole('textbox', { name: 'Retro Note' }),
	).not.toBeVisible();
