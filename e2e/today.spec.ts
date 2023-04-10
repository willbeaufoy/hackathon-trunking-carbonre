import { expect, test } from '@playwright/test';
import { getRandomChars } from './tools';
import { signupAndLogin } from './user-management';

test('today page', async ({ page }) => { // TODO
    const myEmail = `test-${getRandomChars()}@test.com`;
    const myPassword = 'password';

    ///// TODO unauthorised will be bumped

    // // go to landing page
    await signupAndLogin(page, myEmail, myPassword);

    // logs in the Today page
    await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();

    //// new users
    // <--- DELETE
    // no weekly outcomes 
    const all = await page.getByPlaceholder("Enter your weekly outcome").all();
    const values = await Promise.all(all.map(l => l.inputValue()))
    expect(values).toEqual(['', '', '']);
    /// ---> DELETE

    // fill my weekly outcomes
    // * select hot spot
    // * fill input

    // fill my daily outcomes
    // fill my retro

    // go to tomorrow
    // find my weekly outcomes already filled
})


