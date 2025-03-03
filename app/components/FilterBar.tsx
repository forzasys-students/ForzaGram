import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

export default function FilterBar({ filters, selectedFilter, onSelectFilter }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer} 
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            selectedFilter === filter.id && styles.selectedButton, 
          ]}
          onPress={() => onSelectFilter(filter.id)}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter.id && styles.selectedText, 
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    paddingVertical: 10,
    zIndex: 100,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)", 
  },
  selectedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
  },
  filterText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  selectedText: {
    color: "black", 
  },
});