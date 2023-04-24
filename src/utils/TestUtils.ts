import { MockedObject } from "jest-mock";

export function setMockProperty<T>(
  mockObject: MockedObject<object>,
  property: string,
  value: T
) {
  const getter = jest.fn(() => value);
  const setter = jest.fn();
  Object.defineProperty(mockObject, property, {
    get: getter,
    set: setter,
  });

  return [getter, setter];
}
