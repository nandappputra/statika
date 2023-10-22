/**
 * @jest-environment jsdom
 */

import { describe, expect, test } from "@jest/globals";
import { Painter } from "../../models/painters/Painter";
import { ElementFactory } from "../../factories/ElementFactory";
import { ConnectionKind } from "../../utils/Constants";
import { fabric } from "fabric";
import { LoadService } from "./LoadService";
import { Point } from "../../models/diagram_elements/Point";
import { LinkageElement } from "../../models/diagram_elements/LinkageElement";
import { ConnectionElement } from "../../models/diagram_elements/ConnectionElement";
import { Structure } from "../../models/Structure";

describe("LoadService", () => {
  describe("loadState", () => {
    test("Should restore the state of painter and element factory properly", () => {
      const dataUri =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAb3RFWHRmYWN0b3J5AHsiX2xpbmthZ2VDb3VudGVyIjozLCJfZXh0ZXJuYWxGb3JjZUNvdW50ZXIiOjEsIl9jb25uZWN0aW9uQ291bnRlciI6MiwiX3BvaW50Q291bnRlciI6NSwiX2lkQ291bnRlciI6OH2o8jWxAAAGPnRFWHRzdHJ1Y3R1cmUAeyJfbGlua2FnZXMiOlt7Il9uYW1lIjoiTDEiLCJfaWQiOjMsIl9wb2ludHMiOlt7Il9uYW1lIjoiUDEiLCJfaWQiOjEsIl9wb3NpdGlvblgiOjEsIl9wb3NpdGlvblkiOjEsIl9leHRlcm5hbEZvcmNlcyI6W10sIl9GX3giOnsiX3N5bWJvbCI6IkZfUDF4IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfSwiX0ZfeSI6eyJfc3ltYm9sIjoiRl9QMXkiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfTV96Ijp7Il9zeW1ib2wiOiJNX1AxeiIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH19LHsiX25hbWUiOiJQMiIsIl9pZCI6MiwiX3Bvc2l0aW9uWCI6MiwiX3Bvc2l0aW9uWSI6MiwiX2V4dGVybmFsRm9yY2VzIjpbXSwiX0ZfeCI6eyJfc3ltYm9sIjoiRl9QMngiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfRl95Ijp7Il9zeW1ib2wiOiJGX1AyeSIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH0sIl9NX3oiOnsiX3N5bWJvbCI6Ik1fUDJ6IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfX1dfSx7Il9uYW1lIjoiTDIiLCJfaWQiOjYsIl9wb2ludHMiOlt7Il9uYW1lIjoiUDMiLCJfaWQiOjQsIl9wb3NpdGlvblgiOjMsIl9wb3NpdGlvblkiOjMsIl9leHRlcm5hbEZvcmNlcyI6W10sIl9GX3giOnsiX3N5bWJvbCI6IkZfUDN4IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfSwiX0ZfeSI6eyJfc3ltYm9sIjoiRl9QM3kiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfTV96Ijp7Il9zeW1ib2wiOiJNX1AzeiIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH19LHsiX25hbWUiOiJQNCIsIl9pZCI6NSwiX3Bvc2l0aW9uWCI6NCwiX3Bvc2l0aW9uWSI6NCwiX2V4dGVybmFsRm9yY2VzIjpbXSwiX0ZfeCI6eyJfc3ltYm9sIjoiRl9QNHgiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfRl95Ijp7Il9zeW1ib2wiOiJGX1A0eSIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH0sIl9NX3oiOnsiX3N5bWJvbCI6Ik1fUDR6IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfX1dfV0sIl9jb25uZWN0aW9ucyI6W3siX25hbWUiOiJDMSIsIl9pZCI6NywiX3BvaW50cyI6W3siX25hbWUiOiJQMiIsIl9pZCI6MiwiX3Bvc2l0aW9uWCI6MiwiX3Bvc2l0aW9uWSI6MiwiX2V4dGVybmFsRm9yY2VzIjpbXSwiX0ZfeCI6eyJfc3ltYm9sIjoiRl9QMngiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfRl95Ijp7Il9zeW1ib2wiOiJGX1AyeSIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH0sIl9NX3oiOnsiX3N5bWJvbCI6Ik1fUDJ6IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfX0seyJfbmFtZSI6IlAzIiwiX2lkIjo0LCJfcG9zaXRpb25YIjozLCJfcG9zaXRpb25ZIjozLCJfZXh0ZXJuYWxGb3JjZXMiOltdLCJfRl94Ijp7Il9zeW1ib2wiOiJGX1AzeCIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH0sIl9GX3kiOnsiX3N5bWJvbCI6IkZfUDN5IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfSwiX01feiI6eyJfc3ltYm9sIjoiTV9QM3oiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9fV0sIl9jb25uZWN0aW9uIjp7Il9raW5kIjoiRml4ZWQifSwiX2V4dGVybmFsRm9yY2VzIjpbXX1dfdbF4csAAAAGYktHRAD/AP8A/6C9p5MAAAEbSURBVHic7dcxCoNAEAXQj2exsPdquZYXSJ9rpLYP2MYi2wRhsTC6kPdgmpnmVx8mSd4HzS0AP3ZEWT2T9GcHB/5PrYjuF+YC2KgV1uvCXABfunyKCaB5Xepv3+OsIAB7jEmWbN/BpdwAmjIkmZLMZaayAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKApK2AKQD2nvCzNAAAAAElFTkSuQmCC";
      const canvas = new fabric.Canvas(null);
      const painter = new Painter(canvas, [], {
        linkageConfig: {},
        connectionConfig: {},
      });
      const elementFactory = ElementFactory.getInstance();

      const loadService = new LoadService(painter, elementFactory);
      loadService.loadState(dataUri);

      const p1 = new Point("P1", 1, 1, 1);
      const p2 = new Point("P2", 2, 2, 2);
      const l1 = new LinkageElement("L1", 3, p1, p2);

      const p3 = new Point("P3", 4, 3, 3);
      const p4 = new Point("P4", 5, 4, 4);
      const l2 = new LinkageElement("L2", 6, p3, p4);

      const c1 = new ConnectionElement("C1", 7, [p2, p3], ConnectionKind.FIXED);

      const expectedStructure = new Structure([l1, l2], [c1]);
      expect(painter.buildStructure()).toStrictEqual(expectedStructure);

      const expectedState = {
        linkageCounter: 3,
        connectionCounter: 2,
        externalForceCounter: 1,
        pointCounter: 5,
        idCounter: 8,
      };
      expect(elementFactory.getState()).toStrictEqual(expectedState);
    });
  });
});
