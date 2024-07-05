import { useEffect } from "react";
export function useKey(key, action) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code === key) {
          action();
        }
      }
      document.addEventListener("keydown", callback);
      // clean up eventlitener with unmount
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
