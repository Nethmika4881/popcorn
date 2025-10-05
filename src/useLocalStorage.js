import { useState, useEffect } from "react";
export function useLocalStorage(initialValue, keyName) {
  const [value, setValue] = useState(function () {
    const stored = localStorage.getItem(keyName);
    return stored ? JSON.parse(stored) : initialValue; // Return empty array if null
  });

  useEffect(
    function () {
      localStorage.setItem(keyName, JSON.stringify(value));
    },
    [value, keyName]
  );

  return [value, setValue];
}
