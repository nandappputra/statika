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

    test("Should set the variable to known when supplied with value", () => {
      const variable = new Variable("P1");

      variable.value = 3;

      expect(variable.value).toBe(3);
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

  describe("getValueOrSymbol", () => {
    test("Should return the value of the known variable in string format", () => {
      const variable = new Variable("P1", 3);

      expect(variable.getValueOrSymbol()).toBe("3");
    });

    test("Should return the symbol of the variable if not known", () => {
      const variable = new Variable("P1");

      expect(variable.getValueOrSymbol()).toBe("P1");
    });
  });
});
