import { test, expect } from '@playwright/test';
import { getRandomChars } from './tools';
import axios from 'axios';
import { setTimeout } from 'timers/promises';

test('user can CRUD notes', async ({ page }) => {
    const myEmail = `test-${getRandomChars()}@test.com`;
    const myPassword = 'password';

    ///// unauthorised will be bumped

    // go to landing page
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'ZenFocus' })).toBeVisible()

    //// sign up
    // now sign up
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible()
    await page.getByPlaceholder('Email').fill(myEmail);
    await page.getByPlaceholder('Password').fill(myPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();

    // simulate click the verify email
    await setTimeout(100)
    const resp = await axios.get('http://localhost:9099/emulator/v1/projects/nextjs13-vercel/oobCodes');
    const {oobLink} = resp.data.oobCodes.find(({email}) => email === myEmail);
    await axios.get(oobLink);

    //// log in
    await page.goto('/');
    await page.getByRole('link', { name: 'I already have an account' }).click();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await page.getByPlaceholder('Email').fill(myEmail);
    await page.getByPlaceholder('Password').fill(myPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    //// go to notes
    await page.getByRole('link', { name: 'Notes' }).click();
    await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()

    //// create note
    await expect(page.getByLabel('Title')).not.toBeVisible()
    await page.getByRole('button', { name: 'Create' }).click();
   
    const noteTitle = `I am a ${getRandomChars()} note title`;
    await page.getByLabel('Title').fill(noteTitle);
    const note = `I am a ${getRandomChars()} note`;
    await page.getByLabel('Note').fill(note);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByLabel('Title')).not.toBeVisible();

    //// read created note
    await expect(page.getByRole('heading', { name: noteTitle })).toBeVisible()
    await expect(page.getByText(note)).toBeVisible()
    
    //// TODO what about multiple notes?

    //// update note
    await page.getByRole('button', { name: 'Modify' }).click();
    await expect(page.getByRole('button', { name: 'Modify' })).not.toBeVisible();

    const modifiedNoteTitle = `I am a modified ${getRandomChars()} note title`;
    await page.getByLabel('Title').fill(modifiedNoteTitle);
    const modifiedNote = `I am a modified ${getRandomChars()} note`;
    await page.getByLabel('Note').fill(modifiedNote);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: modifiedNoteTitle })).toBeVisible()
    await expect(page.getByText(modifiedNote)).toBeVisible()
    //// TODO delete draft

    //// delete note
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: modifiedNoteTitle })).not.toBeVisible()
    await expect(page.getByRole('heading', { name: noteTitle })).not.toBeVisible()  
})
