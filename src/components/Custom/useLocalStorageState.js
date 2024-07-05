import { useState, useEffect } from "react";
export function useLocalStorageState(initialState, keyName) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(keyName);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(value));
    },
    [value, keyName]
  );
  return [value, setValue];
}
