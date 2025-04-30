import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  selectedFilter: string;
  onSelectFilter: (id: string) => void;
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Index">;

const FilterBar: React.FC<FilterBarProps> = ({ filters, selectedFilter, onSelectFilter }) => {
  const [isEventDropdownOpen, setEventDropdownOpen] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleSelect = (id: string) => {
    onSelectFilter(id);
    setEventDropdownOpen(false);
  };
  const handleNavigateToFixtures = () => {
    navigation.navigate("Fixtures", {  });
  };
  const selectedFilterLabel = () => {
    if (selectedFilter === "1") {
      return "By event";
    }
    const found = filters.find((f) => f.id === selectedFilter);
    return found ? found.label : "By event";
  };
  
  return (
    <View style={styles.container}>
      {/* Main buttons row */}
      <View style={styles.buttonRow}>
        
        {/* "For You" button */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === "1" && styles.selectedButton,
          ]}
          onPress={() => handleSelect("1")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedFilter === "1" && styles.selectedButtonText,
            ]}
          >
            For You
          </Text>
        </TouchableOpacity>

        {/* "By Event" button */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter !== "1" && styles.selectedButton,
          ]}
          onPress={() => setEventDropdownOpen((prev) => !prev)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedFilter !== "1" && styles.selectedButtonText,
            ]}
          >
        {selectedFilterLabel()} ▼
          </Text>
        </TouchableOpacity>

        {/* "All matches" button */}
        <TouchableOpacity style={styles.allMatchesButton} onPress={handleNavigateToFixtures}>
          <Text style={styles.allMatchesText}>All matches</Text>
        </TouchableOpacity>

      </View>

      {/* Dropdown under "By Event" */}
      {isEventDropdownOpen && (
        <View style={styles.dropdownMenu}>
          {filters
            .filter((filter) => filter.id !== "1") // exclude "For You" from dropdown
            .map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={styles.dropdownItem}
                onPress={() => handleSelect(filter.id)}
              >
                <Text style={styles.itemText}>{filter.label}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: "transparent", // <-- make background transparent
    zIndex: 10,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0, // remove extra margin
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee", // gray button background
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: "#000", // selected button black
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedButtonText: {
    color: "#fff",
  },
  allMatchesButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    marginLeft: "auto",
  },
  allMatchesText: {
    fontSize: 14,
    color: "#fff",
  },
  dropdownMenu: {
    position: "absolute", 
  top: 45,               
  left: 110,             
  width: 150,            
  backgroundColor: "#fff",
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
  overflow: "hidden",
  zIndex: 1000,     
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
});

export default FilterBar;
