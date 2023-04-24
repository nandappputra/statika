import { MockedObject } from "jest-mock";

export function setMockProperty(
  mockObject: MockedObject<object>,
  property: string,
  value: unknown
) {
  Object.defineProperty(mockObject, property, {
    get() {
      return value;
    },
  });
}
