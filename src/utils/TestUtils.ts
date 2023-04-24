import { MockedObject } from "jest-mock";

export function setMockProperty<T>(
  mockObject: MockedObject<object>,
  property: string,
  value: T
) {
  const getter = jest.fn<T, [], MockedObject<object>>(() => value);
  const setter = jest.fn<void, [T], MockedObject<object>>();
  Object.defineProperty(mockObject, property, {
    get: getter,
    set: setter,
  });

  return [getter, setter];
}
