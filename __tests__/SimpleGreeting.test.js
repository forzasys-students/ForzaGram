// __tests__/SimpleGreeting.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import { Text, View } from 'react-native';

// A simple Greeting component for testing
const Greeting = ({ name }) => (
  <View>
    <Text testID="greeting">Hello, {name}!</Text>
  </View>
);

describe('Greeting component', () => {
  it('renders with the provided name', () => {
    // Render the component with a test prop
    const tree = renderer.create(<Greeting name="World" />).toJSON();
    
    // Check that the component rendered properly
    expect(tree).toBeDefined();
    // Access the Text component's children and join them to get the full string
    expect(tree.children[0].children.join('')).toBe('Hello, World!');
  });
  
  it('handles different names correctly', () => {
    // Test with another name to ensure component works correctly
    const tree = renderer.create(<Greeting name="Jest" />).toJSON();
    // Access the Text component's children and join them
    expect(tree.children[0].children.join('')).toBe('Hello, Jest!');
  });
});