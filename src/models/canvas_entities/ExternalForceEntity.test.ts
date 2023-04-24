import { jest, describe, expect, test } from "@jest/globals";
import { ExternalForce } from "../ExternalForce";
import { MockedObject } from "jest-mock";
import { ExternalForceEntity } from "./ExternalForceEntity";
import { Point } from "../Point";
import { Painter } from "../painters/Painter";
import { ElementType } from "../../utils/Constants";
import { setMockProperty } from "../../utils/TestUtils";

describe("ExternalForceEntity", () => {
  let point: MockedObject<Point>;
  let externalForce: MockedObject<ExternalForce>;
  let eventMediator: MockedObject<Painter>;
  let externalForceEntity: ExternalForceEntity;

  beforeEach(() => {
    point = jest.createMockFromModule<Point>("../Point");
    externalForce =
      jest.createMockFromModule<ExternalForce>("../ExternalForce");
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name and type in its data", () => {
      setMockProperty(externalForce, "name", "F1");

      externalForceEntity = new ExternalForceEntity(
        externalForce,
        point,
        eventMediator
      );

      const actualObjects = externalForceEntity.getObjectsToDraw();
      const expectedObject = {
        name: "F1",
        type: ElementType.FORCE,
      };

      expect(actualObjects.length).toBe(1);
      expect(actualObjects[0].data).toStrictEqual(expectedObject);
    });
  });
});
