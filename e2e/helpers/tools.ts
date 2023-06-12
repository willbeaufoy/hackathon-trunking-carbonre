export const getRandomChars = () => Math.random().toString(36).slice(2);

const clean = (title: string) => title.replace(/[^a-zA-Z0-9]/g, '_');

export const testInfoToEmail = testInfo =>
	`${clean(testInfo.title)}-${getRandomChars()}@test.com`;

export const mockDate = (fakeNow: number) => `{
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
  }`;
