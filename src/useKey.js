import { useEffect } from "react";
export function useKey(key, action) {
  useEffect(
    function () {
      const handleFunc = function (e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action?.();
        }
      };
      document.addEventListener("keydown", handleFunc);

      return function () {
        document.removeEventListener("keydown", handleFunc);
      };
    },
    [action, key]
  );
}
