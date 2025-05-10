// File: __tests__/Fixtures.test.js

import React from 'react';
import renderer from 'react-test-renderer';
import Fixtures from '../Screens/Fixtures';

// Mock the react-navigation hooks to isolate the component from navigation concerns.
// This allows testing the component's logic without needing a full navigation setup.
// We replace `useNavigation` and `useRoute` with mock implementations.
// `jest.requireActual` is used to ensure other parts of '@react-navigation/native' are not unintentionally mocked.
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock the global fetch function.
// This is crucial for controlling API responses during tests,
// ensuring tests are predictable and not dependent on actual network requests.
global.fetch = jest.fn();

describe('Fixtures Screen', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('displays fixtures after data is loaded', async () => {
    // Mock the API response for fetching initial game IDs from Google Sheets.
    // `fetch.mockImplementationOnce` is used because this specific response is expected
    // only for the first call to fetch in this test.
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve({
          values: [
            ['data1', 'data2', 'data3', 'data4', 'game123'],
            ['data1', 'data2', 'data3', 'data4', 'game456']
          ]
        })
      })
    );

    // Mock the API response for fetching detailed match information.
    // This mock will be used for subsequent calls to fetch (for game123 and game456).
    // It provides a consistent data structure for each game's details.
    const mockMatchData = {
      home_team: {
        name: 'Home Team',
        logo_url: 'http://example.com/logo1.png'
      },
      visiting_team: {
        name: 'Away Team',
        logo_url: 'http://example.com/logo2.png'
      },
      home_team_goals: 2,
      visiting_team_goals: 1,
      start_of_1st_half: '2023-01-01T15:00:00Z'
    };

    // Setup fetch to return the mock match data for any subsequent calls
    fetch.mockImplementation(() => 
      Promise.resolve({
        json: () => Promise.resolve(mockMatchData)
      })
    );

    // Asynchronously render the Fixtures component.
    // `renderer.act` is used to wrap rendering and updates involving asynchronous operations,
    // such as state changes triggered by `useEffect` and API calls.
    // This ensures that React has processed all updates before assertions are made.
    let component;
    await renderer.act(async () => {
      component = renderer.create(<Fixtures />);
    });
    
    // Basic assertion: Check if the component instance is defined after rendering.
    // This confirms that the component did not crash during the initial render and asynchronous updates.
    expect(component).toBeDefined();

    // Verify that the `fetch` mock was called the expected number of times.
    // In this case: 1 call for Google Sheets + 2 calls for individual match details.
    expect(fetch).toHaveBeenCalledTimes(3);
    
    // Verify that the `fetch` mock was called with the correct URLs (or parts of them).
    // This uses `toMatch` with regular expressions to check for substrings in the called URLs,
    // providing flexibility if the exact URLs have dynamic parts beyond what's being tested.
    expect(fetch.mock.calls[0][0]).toMatch(/google/);
    expect(fetch.mock.calls[1][0]).toMatch(/game123/);
    expect(fetch.mock.calls[2][0]).toMatch(/game456/);
  });

  it('handles empty data response gracefully', async () => {
    // Simulate Google Sheets API returning an empty list of values.
    // This could happen if no games are scheduled or data was deleted.
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ values: [] }),
      })
    );
  
    let component;
    await renderer.act(async () => {
      // Asynchronously render the component.
      // The act wrapper ensures all updates from useEffect are flushed before assertions.
      component = renderer.create(<Fixtures />);
    });
  
    // Confirm the component still renders without crashing, even with no data.
    expect(component).toBeDefined();
  
    // Only one fetch call should occur (the Google Sheets request).
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('handles fetch error gracefully', async () => {
    // Simulate a network failure or other fetch error.
    // This test ensures the component does not crash when an exception is thrown.
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );
  
    let component;
    await renderer.act(async () => {
      // Asynchronously render the component.
      // The error from fetch should be caught in the component and not crash rendering.
      component = renderer.create(<Fixtures />);
    });
  
    // Component should render without throwing even if fetch fails.
    expect(component).toBeDefined();
  
    // One fetch call is expected (attempt to fetch from Google Sheets).
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  
});