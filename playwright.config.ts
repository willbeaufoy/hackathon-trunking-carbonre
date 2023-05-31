import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: './.env.e2e' });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
let config: PlaywrightTestConfig = {
	testDir: './e2e',
	/* Maximum time one test can run for. */
	timeout: 30000,
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 5000,
	},
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	// forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	// retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	// workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'line',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 5000,
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: 'http://localhost:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		// trace: 'on-first-retry',
		trace: 'on',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		// {
		//   name: 'firefox',
		//   use: { ...devices['Desktop Firefox'] },
		// },
		// {
		//   name: 'webkit',
		//   use: { ...devices['Desktop Safari'] },
		// },
		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },
		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { channel: 'chrome' },
		// },
	],

	/* Folder for test artifacts such as screenshots, videos, traces, etc. */
	// outputDir: 'test-results/',
	/* Run your local dev server before starting the tests */
	// globalSetup: require.resolve('./global-setup',
	webServer: [
		{
			command: 'npm run dev',
			port: 3000,
			reuseExistingServer: true,
		},
		{
			command: 'npm run firebase:start',
			port: 4000,
			reuseExistingServer: true,
		},
	],
};

if (process.env.CI === 'true') {
	config = {
		...config,
		forbidOnly: !!process.env.CI,
		retries: 2,
		reporter: 'html',
		workers: 2,
	};
}

if (process.env.SMOKE_TEST === 'true') {
	config = {
		...config,
		use: {
			...config.use,
			baseURL: 'https://trunking-carbonre.vercel.app/',
		},
		webServer: undefined,
	};
} else {
	process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
	process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
}

export default defineConfig(config);
