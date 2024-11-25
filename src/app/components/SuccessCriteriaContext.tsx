import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Context
const SuccessCriteriaContext = createContext({});

// Provider Component
export const SuccessCriteriaProvider = ({ children }) => {
  const [successCriteriaList, setSuccessCriteriaList] = useState<any>([]);

  // Function to load success criteria list from storage
  const loadSuccessCriteriaList = async () => {
    try {
      const data = await AsyncStorage.getItem("successCriteriaList");
      if (data) {
        setSuccessCriteriaList(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load success criteria list:", error);
    }
  };

  // Function to save success criteria list to storage
  const saveSuccessCriteriaList = async (list) => {
    try {
      await AsyncStorage.setItem("successCriteriaList", JSON.stringify(list));
    } catch (error) {
      console.error("Failed to save success criteria list:", error);
    }
  };

  // Function to add or update a criteria in the list
  const addCriteria = async (newCriteria) => {
    setSuccessCriteriaList((prevList) => {
      // Update or add the new criteria
      const updatedList = prevList.map((item) =>
        item.cycle === newCriteria.cycle && item.run === newCriteria.run
          ? { ...item, ...newCriteria } // Update existing criteria
          : item
      );

      // Check if the criteria is already in the list
      const isExisting = updatedList.some(
        (item) =>
          item.cycle === newCriteria.cycle && item.run === newCriteria.run
      );

      // Append new criteria if it's not already in the list
      const finalList = isExisting ? updatedList : [...updatedList, newCriteria];

      // Save the updated list to AsyncStorage
      saveSuccessCriteriaList(finalList);

      return finalList;
    });
  };

  // Function to delete a criteria by cycle and run
  const deleteCriteria = async (cycle, run) => {
    setSuccessCriteriaList((prevList) => {
      const updatedList = prevList.filter(
        (item) => item.cycle !== cycle || item.run !== run
      );

      // Save the updated list to AsyncStorage
      saveSuccessCriteriaList(updatedList);

      return updatedList;
    });
  };

  // Load the success criteria list from storage on initial render
  useEffect(() => {
    loadSuccessCriteriaList();
  }, []);

  return (
    <SuccessCriteriaContext.Provider
      value={{
        successCriteriaList,
        addCriteria,
        deleteCriteria,
      }}
    >
      {children}
    </SuccessCriteriaContext.Provider>
  );
};

// Custom Hook for accessing the context
export const useSuccessCriteria = () => {
  return useContext(SuccessCriteriaContext);
};
