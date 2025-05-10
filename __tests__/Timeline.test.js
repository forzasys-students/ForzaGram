import React from 'react';
import renderer from 'react-test-renderer';
import Timeline from '../Screens/Timeline';
import { render, waitFor } from '@testing-library/react-native';

// Mock navigation (useNavigation, useRoute)
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({ params: { gameid: 'game123' } }),
}));

// Mock global fetch
global.fetch = jest.fn();


/**
 * This mock is used during Jest tests to prevent errors related to font loading,
 * which is normally handled by expo-font in a real Expo app.
 *
 * In production, expo-font loads icon fonts (like FontAwesome) used by @expo/vector-icons.
 * In Jest, there's no actual font rendering, so we just pretend the fonts are loaded.
 * This avoids crashes like: "loadedNativeFonts.forEach is not a function".
 */
jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
    isLoaded: jest.fn().mockReturnValue(true),
  }));
  

describe('Timeline Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders match info and events correctly', async () => {
    // Mock match info fetch
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          id: 'game123',
          date: '2023-01-01',
          home_team: { id: 'home1', name: 'Home Team', short_name: 'HOME', logo_url: 'http://logo.com/home.png' },
          visiting_team: { id: 'away1', name: 'Away Team', short_name: 'AWAY', logo_url: 'http://logo.com/away.png' },
          home_team_goals: 2,
          visiting_team_goals: 1,
        }),
      })
    );

    // Mock event fetch
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          events: [
            {
              game_time: 540, // 9th minute
              playlist: {
                events: [{ from_timestamp: 0, to_timestamp: 10, video_asset_id: 1 }],
              },
              tag: {
                action: 'goal',
                scorer: { value: 'Player 1' },
                team: { id: 'home1', value: 'Home Team' },
                'shot type': { value: 'header' },
              },
              score: '1-0'
            }
          ]
        }),
      })
    );

    let component;
    await renderer.act(async () => {
      component = renderer.create(<Timeline />);
    });

    expect(component).toBeDefined();
    const textTree = component.toJSON();
    expect(JSON.stringify(textTree)).toContain('HOME');
    expect(JSON.stringify(textTree)).toContain('AWAY');
    expect(JSON.stringify(textTree)).toContain("Player 1");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('shows fallback UI when fetch fails', async () => {
    // Simulate a failed fetch
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    let component;
    await renderer.act(async () => {
      component = renderer.create(<Timeline />);
    });

    const textTree = component.toJSON();
    expect(JSON.stringify(textTree)).toContain('Failed to load match data');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator before data is fetched', async () => {
    const { getByTestId } = render(<Timeline />);

    // Assert loading indicator is shown
    expect(getByTestId('loading-indicator')).toBeTruthy();

    // Wait for fetch to resolve
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('skips rendering events with missing required fields', () => {
    const brokenEvent = { eventType: null };
    const { queryByText } = render(<Timeline events={[brokenEvent]} />);
    expect(queryByText(/View/)).toBeNull(); // or any visible element
  });
});
