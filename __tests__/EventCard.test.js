import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventCard from '../components/EventCard';
import { useNavigation } from '@react-navigation/native';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

// Mock icons to avoid font loading issues
jest.mock('@expo/vector-icons', () => ({
    FontAwesome: ({ name }) => <>{name}</>,
}));

describe('EventCard', () => {
    const baseProps = {
        matchInfo: {},
        assetId: 123,
        from: 10,
        to: 20,
        scorer: 'Player 1',
        eventType: 'goal',
        teamId: 'home123',
        homeTeamId: 'home123',
        visitingTeamId: 'away123',
        result: '1-0',
        gametime: 2700, // 45 minute, in seconds
    };

    it('renders goal event with scorer name and minute (Home)', () => {
        const { getByText } = render(<EventCard {...baseProps} />);
        expect(getByText("Player 1")).toBeTruthy();
        expect(getByText("45'")).toBeTruthy(); // goal time, in this case 45' because 45 * 60 = 2700 seconds
        expect(getByText("1")).toBeTruthy(); // Home team score
        expect(getByText(/0/)).toBeTruthy(); // visiting team score
    });

    it('renders yellow card event properly', () => {
        const { getByTestId } = render(
            <EventCard {...baseProps} eventType="yellow card" />
        );
        expect(getByTestId('yellow-card')).toBeTruthy();
    });

    // Test for rendering red card event properly
    it('renders red card event properly', () => {
        const { getByTestId } = render(
            <EventCard {...baseProps} eventType="red card" />
        );
        expect(getByTestId('red-card')).toBeTruthy();
    });

    // Test for rendering substitution event with correct details
    it('renders substitution event properly', () => {
        const { getByTestId } = render(
            <EventCard {...baseProps}
                eventType="substitution"
                substitution_in="player in"
                substitution_out="player out"
            />
        );
        expect(getByTestId('substitution')).toBeTruthy();
        expect(getByTestId('substitution-in')).toBeTruthy();
        expect(getByTestId('substitution-out')).toBeTruthy();
        expect(getByTestId('substitution-in').props.children).toBe('player in');
        expect(getByTestId('substitution-out').props.children).toBe('player out');
    });


    // Test for rendering goal event with scorer name and minute for the visiting team
    it('renders goal event with scorer name and minute (Visiting)', () => {
        const { getByText } = render(
            <EventCard
                {...baseProps}
                scorer='Player 2'
                result='1-2'
                gametime={4080} // 68 minute, in seconds
                teamId='away123'
            />);
        expect(getByText("Player 2")).toBeTruthy();
        expect(getByText("68'")).toBeTruthy(); // goal time, in this case 45' because 45 * 60 = 2700 seconds
        expect(getByText("2")).toBeTruthy(); // visiting team score
        expect(getByText(/1/)).toBeTruthy();
        // Home team score. The reason it's in this form is because the away team, and that has a bold
        // text for their score. The home team score is in normal text.
    });

    // Test for rendering assist and shotType details correctly
    it('renders assist and shotType correctly', () => {
        const { getByText } = render(
            <EventCard
                {...baseProps}
                assist="player2"
                shotType="header"
            />
        );
        expect(getByText(/Header/i)).toBeTruthy();
        expect(getByText(/Assist by/i)).toBeTruthy();
    });

    // Test for rendering neutral events (half time and full time)
    it('renders multiple neutral events correctly', () => {
        // render first with half time event
        const { getByText, rerender } = render(
            <EventCard
                {...baseProps}
                eventType="half time"
                teamId={undefined}
            />
        );
        expect(getByText(/HALF TIME/i)).toBeTruthy();

        // Re-render with a end of game event
        rerender(
            <EventCard
                {...baseProps}
                eventType="end of game"
                teamId={undefined}
            />
        );
        expect(getByText(/FULL TIME/i)).toBeTruthy();
    });

    // Test for navigation to VideoScreen when play button is pressed
    it('navigates to VideoScreen on press', () => {
        const navigateMock = jest.fn();
        jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({ navigate: navigateMock });

        const { getByTestId } = render(<EventCard {...baseProps} />);
        const playButton = getByTestId('event-play-button');
        fireEvent.press(playButton);

        expect(navigateMock).toHaveBeenCalledWith('VideoScreen', expect.objectContaining({
            assetId: baseProps.assetId,
            from: baseProps.from,
            to: baseProps.to,
            matchInfo: baseProps.matchInfo,
        }));
    });


    // Test for rendering own goal event with correct details
    it('renders own goal event correctly', () => {
        const { getByTestId, getByText } = render(
            <EventCard {...baseProps} eventType="goal" shotType="own goal" scorer="Player 4" />
        );

        expect(getByText('Own goal')).toBeTruthy(); // Check if "Own Goal" is rendered
        expect(getByText('Player 4')).toBeTruthy(); // Check if scorer is rendered
    });


});
