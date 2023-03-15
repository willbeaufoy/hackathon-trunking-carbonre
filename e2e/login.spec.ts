import { test, expect } from '@playwright/test';
import { getRandomChars } from './tools';
import axios from 'axios';
import {setTimeout} from 'timers/promises'

// AS A new user
// I WANT TO sign up
// SO THAT I can use the app
test('new users can sign up / sign in', async ({ page }) => {
    const myEmail = `test-${getRandomChars()}@test.com`;
    const myPassword = 'password';

    await page.goto('/');
    await page.getByRole('heading', { name: 'Home' }).click();

    // try login with not existing credentials
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await page.getByLabel('Email:').fill(myEmail);
    await page.getByLabel('Password:').fill(myPassword);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible()
    
    // sign up
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible()
    await page.getByLabel('Email:').fill(myEmail);
    await page.getByLabel('Password:').fill(myPassword);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Validate email' })).toBeVisible()

    // validate email
    const resp = await axios.get('http://localhost:9099/emulator/v1/projects/nextjs13-vercel/oobCodes');
    const {oobLink} = resp.data.oobCodes.find(({email}) => email === myEmail);
    await axios.get(oobLink);

    
    // go to landing page
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
    await page.getByLabel('Email:').fill(myEmail);
    // wrong password -> no login
    await page.getByLabel('Password:').fill(myPassword + 'typo');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid email or password')).toBeVisible()

    await page.getByLabel('Password:').fill(myPassword);
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('heading', { name: 'Home' }).click();
    await expect(page.getByText(myEmail)).toBeVisible()

    await page.getByRole('link', { name: 'Sign out' }).click();
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
    await expect(page.getByText(myEmail)).not.toBeVisible()

})