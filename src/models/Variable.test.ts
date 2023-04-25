import { describe, expect, test } from "@jest/globals";
import { Variable } from "./Variable";

describe("Variable", () => {
  describe("value", () => {
    test("Should return the value for a variable", () => {
      const variable = new Variable("P1", 3);

      expect(variable.value).toBe(3);
    });

    test("Should throw an error if the variable has no value", () => {
      const variable = new Variable("P1");

      expect(() => variable.value).toThrow(
        "failed to get P1 value: value not set"
      );
    });
  });

  describe("clear", () => {
    test("Should delete the variable value and set the variable to unknown", () => {
      const variable = new Variable("P1", 3);
      variable.clear();

      expect(() => variable.value).toThrow(
        "failed to get P1 value: value not set"
      );
    });
  });
});
