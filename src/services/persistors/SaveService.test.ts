import { describe, expect, test } from "@jest/globals";
import { Painter } from "../../models/painters/Painter";
import { ElementFactory } from "../../factories/ElementFactory";
import { ConnectionKind } from "../../utils/Constants";
import { SaveService } from "./SaveService";
import { fabric } from "fabric";

describe("SaveService", () => {
  describe("buildPngWithMetadata", () => {
    test("Should build a PNG with proper metadata", () => {
      const canvas = new fabric.Canvas(null);
      const painter = new Painter(canvas, [], {
        linkageConfig: {},
        connectionConfig: {},
      });
      const elementFactory = ElementFactory.getInstance();

      const p1 = elementFactory.buildPoint({ x: 1, y: 1 });
      const p2 = elementFactory.buildPoint({ x: 2, y: 2 });
      const l1 = elementFactory.buildLinkage(p1, p2);

      const p3 = elementFactory.buildPoint({ x: 3, y: 3 });
      const p4 = elementFactory.buildPoint({ x: 4, y: 4 });
      const l2 = elementFactory.buildLinkage(p3, p4);

      const c1 = elementFactory.buildConnection([p2, p3], ConnectionKind.FIXED);

      painter.addElement(l1);
      painter.addElement(l2);
      painter.addElement(c1);

      const saveService = new SaveService(painter, elementFactory);
      const pngDataUri = saveService.buildPngWithMetadata();

      expect(pngDataUri).toBe(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAb3RFWHRmYWN0b3J5AHsiX2xpbmthZ2VDb3VudGVyIjozLCJfZXh0ZXJuYWxGb3JjZUNvdW50ZXIiOjEsIl9jb25uZWN0aW9uQ291bnRlciI6MiwiX3BvaW50Q291bnRlciI6NSwiX2lkQ291bnRlciI6OH2o8jWxAAAGPnRFWHRzdHJ1Y3R1cmUAeyJfbGlua2FnZXMiOlt7Il9uYW1lIjoiTDEiLCJfaWQiOjMsIl9wb2ludHMiOlt7Il9uYW1lIjoiUDEiLCJfaWQiOjEsIl9wb3NpdGlvblgiOjEsIl9wb3NpdGlvblkiOjEsIl9leHRlcm5hbEZvcmNlcyI6W10sIl9GX3giOnsiX3N5bWJvbCI6IkZfUDF4IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfSwiX0ZfeSI6eyJfc3ltYm9sIjoiRl9QMXkiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfTV96Ijp7Il9zeW1ib2wiOiJNX1AxeiIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH19LHsiX25hbWUiOiJQMiIsIl9pZCI6MiwiX3Bvc2l0aW9uWCI6MiwiX3Bvc2l0aW9uWSI6MiwiX2V4dGVybmFsRm9yY2VzIjpbXSwiX0ZfeCI6eyJfc3ltYm9sIjoiRl9QMngiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfRl95Ijp7Il9zeW1ib2wiOiJGX1AyeSIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH0sIl9NX3oiOnsiX3N5bWJvbCI6Ik1fUDJ6IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfX1dfSx7Il9uYW1lIjoiTDIiLCJfaWQiOjYsIl9wb2ludHMiOlt7Il9uYW1lIjoiUDMiLCJfaWQiOjQsIl9wb3NpdGlvblgiOjMsIl9wb3NpdGlvblkiOjMsIl9leHRlcm5hbEZvcmNlcyI6W10sIl9GX3giOnsiX3N5bWJvbCI6IkZfUDN4IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfSwiX0ZfeSI6eyJfc3ltYm9sIjoiRl9QM3kiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfTV96Ijp7Il9zeW1ib2wiOiJNX1AzeiIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH19LHsiX25hbWUiOiJQNCIsIl9pZCI6NSwiX3Bvc2l0aW9uWCI6NCwiX3Bvc2l0aW9uWSI6NCwiX2V4dGVybmFsRm9yY2VzIjpbXSwiX0ZfeCI6eyJfc3ltYm9sIjoiRl9QNHgiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfRl95Ijp7Il9zeW1ib2wiOiJGX1A0eSIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH0sIl9NX3oiOnsiX3N5bWJvbCI6Ik1fUDR6IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfX1dfV0sIl9jb25uZWN0aW9ucyI6W3siX25hbWUiOiJDMSIsIl9pZCI6NywiX3BvaW50cyI6W3siX25hbWUiOiJQMiIsIl9pZCI6MiwiX3Bvc2l0aW9uWCI6MiwiX3Bvc2l0aW9uWSI6MiwiX2V4dGVybmFsRm9yY2VzIjpbXSwiX0ZfeCI6eyJfc3ltYm9sIjoiRl9QMngiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9LCJfRl95Ijp7Il9zeW1ib2wiOiJGX1AyeSIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH0sIl9NX3oiOnsiX3N5bWJvbCI6Ik1fUDJ6IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfX0seyJfbmFtZSI6IlAzIiwiX2lkIjo0LCJfcG9zaXRpb25YIjozLCJfcG9zaXRpb25ZIjozLCJfZXh0ZXJuYWxGb3JjZXMiOltdLCJfRl94Ijp7Il9zeW1ib2wiOiJGX1AzeCIsIl9rbm93biI6ZmFsc2UsIl92YWx1ZSI6MH0sIl9GX3kiOnsiX3N5bWJvbCI6IkZfUDN5IiwiX2tub3duIjpmYWxzZSwiX3ZhbHVlIjowfSwiX01feiI6eyJfc3ltYm9sIjoiTV9QM3oiLCJfa25vd24iOmZhbHNlLCJfdmFsdWUiOjB9fV0sIl9jb25uZWN0aW9uIjp7Il9raW5kIjoiRml4ZWQifSwiX2V4dGVybmFsRm9yY2VzIjpbXX1dfdbF4csAAAAGYktHRAD/AP8A/6C9p5MAAAEbSURBVHic7dcxCoNAEAXQj2exsPdquZYXSJ9rpLYP2MYi2wRhsTC6kPdgmpnmVx8mSd4HzS0AP3ZEWT2T9GcHB/5PrYjuF+YC2KgV1uvCXABfunyKCaB5Xepv3+OsIAB7jEmWbN/BpdwAmjIkmZLMZaayAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKApK2AKQD2nvCzNAAAAAElFTkSuQmCC"
      );
    });
  });
});
