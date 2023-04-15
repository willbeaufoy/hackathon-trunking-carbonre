import { expect, test } from '@playwright/test';
import { getRandomChars } from './helpers/tools';
import { signupAndLogin } from './helpers/user-management';

test('user can CRUD notes', async ({ page }) => {
	const myEmail = `test-${getRandomChars()}@test.com`;
	const myPassword = 'password';

	///// TODO unauthorised will be bumped

	// go to landing page
	await signupAndLogin(page, myEmail, myPassword);

	//// go to notes
	await page.getByRole('link', { name: 'Notes' }).click();
	await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible();

	//// create note
	await expect(page.getByLabel('Title')).not.toBeVisible();
	await page.getByRole('button', { name: 'Create' }).click();

	const noteTitle = `I am a ${getRandomChars()} note title`;
	await page.getByLabel('Title').fill(noteTitle);
	const note = `I am a ${getRandomChars()} note`;
	await page.getByLabel('Note').fill(note);
	await page.getByRole('button', { name: 'Save' }).click();
	await expect(page.getByLabel('Title')).not.toBeVisible();

	//// read created note
	await expect(page.getByRole('heading', { name: noteTitle })).toBeVisible();
	await expect(page.getByText(note)).toBeVisible();

	//// TODO what about multiple notes?

	//// update note
	await page.getByRole('button', { name: 'Modify' }).click();
	await expect(page.getByRole('button', { name: 'Modify' })).not.toBeVisible();

	const modifiedNoteTitle = `I am a modified ${getRandomChars()} note title`;
	await page.getByLabel('Title').fill(modifiedNoteTitle);
	const modifiedNote = `I am a modified ${getRandomChars()} note`;
	await page.getByLabel('Note').fill(modifiedNote);
	await page.getByRole('button', { name: 'Save' }).click();

	await expect(
		page.getByRole('heading', { name: modifiedNoteTitle }),
	).toBeVisible();
	await expect(page.getByText(modifiedNote)).toBeVisible();
	//// TODO delete draft

	//// delete note
	await page.getByRole('button', { name: 'Delete' }).click();
	await expect(
		page.getByRole('heading', { name: modifiedNoteTitle }),
	).not.toBeVisible();
	await expect(
		page.getByRole('heading', { name: noteTitle }),
	).not.toBeVisible();
});
