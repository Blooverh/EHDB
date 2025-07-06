
import { cnCollectionCPU } from '../scrapers/cpuCollectionScraper/cnCpuScraper.js';
import puppeteer from 'puppeteer';
import {jest} from '@jest/globals';
const cnCollectionURL = 'https://cloudninjas.com/collections/cloud-ninjas-cpu-collection-processors';
// Mock puppeteer
// replaces a module dependency in our code so we can control its behaviour during testing
jest.mock('puppeteer');

// Mock the data handler when available to be tested


/* 
    How the functions run within this method:
    1. beforeEach()
    2. test 1 
    3. afterEach()

    4. beforeEach()
    5. test 2
    6. afterEach()

    .
    .
    .
*/

describe('cnCollectionCPU scraper', () => {
    let browser, page, mockExit;

    // Runs before each test to set up mocks and environment
    beforeEach(() => {

        // Mock a Puppeteer page object with stubbed methods
        page = {
            goto: jest.fn(),  // Mock the 'goto' method, used for navigation
            $$eval: jest.fn(), // Mock the '$$eval' method, used to evaluate selectors
        };
        // Mock a Puppeteer browser object with stubbed methods
        browser = {
            newPage: jest.fn().mockResolvedValue(page), // Mock 'newPage' to return the mocked page, since it is an async function we use mockResolvedValue()
            close: jest.fn(),// Mock 'close' to simulate closing the browser 
        };
        puppeteer.launch = jest.fn().mockResolvedValue(browser);

        // Mock console logs to prevent cluttering test output
        //.mockImplementation({}) is an empty function, hence console.log and console.error don't do anything
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});

        // Mock process.exit to prevent tests from terminating
        // mockImplementation() method replaces process.exit() function to throw an error displaying which code was called with process.exit
        // if process.exit(1) - then mocked function will throw an error letting us know what code was used in process.exit()
        mockExit = jest.spyOn(process, 'exit').mockImplementation(code => {
            // Throw an error to be caught by the test runner, indicating process.exit was called
            throw new Error(`process.exit called with code ${code}`);
        });
    });

    // This function is only ran after the test is ran
    afterEach(() => {
        // Restore mocks after each test
        jest.restoreAllMocks();
    });

    /* Test 1 
        - Mocks `page.$$eval` to simulate scraping CPU titles and prices by returning arrays (because original function uses `.map`)
        - Expects `cnCollectionCPU()` to call `process.exit(0)`, which is mocked to throw an error (used to assert it was called)
        - Verifies `puppeteer.launch` is called with `{ headless: true }`
        - Verifies `browser.newPage()` is called
        - Verifies `page.goto()` is called with the correct URL and navigation options (`waitUntil` and `timeout`)
        - Verifies `page.$$eval` is called twice — once for CPU titles, once for prices
        - Verifies `browser.close()` is called after scraping is done
        - Verifies `process.exit(0)` is called at the end of the function
    */
    test('should scrape CPU data successfully and close the browser', async () => {
        const mockTitles = ['CPU Model 1', 'CPU Model 2'];
        const mockPrices = ['$100.00', '$200.00'];

        // Mock the return values for page evaluations
        page.$$eval.mockImplementation((selector, callback) => {
            if (selector.includes('.listText a')) {
                return Promise.resolve(mockTitles);
            }
            if (selector.includes('.price-cart span')) {
                return Promise.resolve(mockPrices);
            }
            return Promise.resolve([]);
        });

        // Expect process.exit to be called, which we mock to throw an error
        await expect(cnCollectionCPU()).rejects.toThrow('process.exit called with code 0');

        // Verify that the browser was launched and the correct page was visited
        expect(puppeteer.launch).toHaveBeenCalledWith({ headless: true });
        expect(browser.newPage).toHaveBeenCalled();
        expect(page.goto).toHaveBeenCalledWith(cnCollectionURL, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        // Verify that the scraping logic was executed
        expect(page.$$eval).toHaveBeenCalledTimes(2);

        // Verify that the browser was closed and process.exit was called
        expect(browser.close).toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledWith(0);
    });

    /* Test 2
        - Simulates a scraping error by mocking `page.goto` to reject with an error
        - Expects `cnCollectionCPU()` to call `process.exit(0)`, which is mocked to throw an error for assertion
        - Verifies that the error message "Error Scraping: Cloud Ninjas" is logged using `console.error`
        - Verifies that the actual error object (`scrapingError`) is logged
        - Verifies that `browser.close()` is still called even after an error (ensuring proper cleanup)
        - Verifies that `process.exit(0)` is called at the end of error handling
    */
    test('should handle scraping errors gracefully', async () => {
        const scrapingError = new Error('Failed to load page');
        page.goto.mockRejectedValue(scrapingError);

        // Expect process.exit to be called, which we mock to throw an error
        await expect(cnCollectionCPU()).rejects.toThrow('process.exit called with code 0');

        // Verify that the error was logged
        expect(console.error).toHaveBeenCalledWith('Error Scraping: Cloud Ninjas');
        expect(console.error).toHaveBeenCalledWith(scrapingError);

        // Verify that the browser was still closed
        expect(browser.close).toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledWith(0);
    });

    /* Test 3
        - Simulates a case where the page evaluation returns no CPU titles or prices by mocking `page.$$eval` to resolve to an empty array
        - Expects `cnCollectionCPU()` to call `process.exit(0)`, which is mocked to throw an error for test assertion
        - Verifies that no error was logged to `console.error`, meaning the function handled the empty data case gracefully
        - Verifies that the browser was properly closed after execution
        - Verifies that `process.exit(0)` was called to end the process cleanly
    */

    test('should handle cases where no titles or prices are found', async () => {
        // Mock empty returns from the page evaluation
        page.$$eval.mockResolvedValue([]);

        // Expect process.exit to be called
        await expect(cnCollectionCPU()).rejects.toThrow('process.exit called with code 0');

        // Verify that scraping completed without errors, even with no data
        expect(console.error).not.toHaveBeenCalled();
        expect(browser.close).toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledWith(0);
    });
});
