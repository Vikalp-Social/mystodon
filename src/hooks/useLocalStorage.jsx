import { useEffect } from "react";
import { useState } from "react"

// useLocalStorage is a custom hook that is used to store data in the local storage of the browser. 
// It takes in a key and an initial value and returns the value and a function to set the value. 
// If the key is not found in the local storage, it returns the initial value. If the key is found, it returns the value stored in the local storage.
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const localValue = window.localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : initialValue;
    } catch (err) {
      console.log(err)
      return initialValue;
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
export default useLocalStorage