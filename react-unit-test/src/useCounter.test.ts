import { renderHook } from "@testing-library/react";
import useCounter from "./useCounter";
import { act } from "react-dom/test-utils";

test('useCounter', () => {
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const hook = renderHook(() => useCounter(0));
  const [, increment, decrement] = hook.result.current;

  act(() => {
    increment(2);
  });
  expect(hook.result.current[0]).toBe(2);

  act(() => {
    decrement(3);
  });
  expect(hook.result.current[0]).toBe(-1);

  hook.unmount();
});
