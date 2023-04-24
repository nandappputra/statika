import { jest, describe, expect, test } from "@jest/globals";
import { MockedObject } from "jest-mock";
import { Point } from "../Point";
import { Painter } from "../painters/Painter";
import { ElementType } from "../../utils/Constants";
import { setMockProperty } from "../../utils/TestUtils";
import { Connection } from "../diagram_elements/connections/Connection";
import { ConnectionEntity } from "./ConnectionEntity";

describe("ExternalForceEntity", () => {
  let connection: MockedObject<Connection>;
  let eventMediator: MockedObject<Painter>;
  let connectionEntity: ConnectionEntity;

  beforeEach(() => {
    connection = jest.createMockFromModule<Connection>(
      "../diagram_elements/connections/Connection"
    );
    eventMediator = jest.createMockFromModule<Painter>("../painters/Painter");
  });

  describe("getObjectsToDraw", () => {
    test("Should return an array of Fabric Object with name, pointName, and type in its data", () => {
      const p1 = new Point("P1", 1, 1);
      const p2 = new Point("P2", 2, 2);
      setMockProperty(connection, "points", [p1, p2]);
      setMockProperty(connection, "name", "C1");

      connectionEntity = new ConnectionEntity(connection, eventMediator);

      const actualObjects = connectionEntity.getObjectsToDraw();
      const expectedObject = {
        name: "C1",
        pointName: "P1",
        type: ElementType.CONNECTION,
      };

      expect(actualObjects.length).toBe(1);
      expect(actualObjects[0].data).toStrictEqual(expectedObject);
    });
  });
});
