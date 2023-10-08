import { ElementFactory } from "../../factories/ElementFactory";
import { Painter } from "../../models/painters/Painter";

export class SaveService {
  generateTag(painter: Painter, elementFactory: ElementFactory) {
    return {
      structure: this._getStructureJson(painter),
      elementFactory: this._getElementFactoryJson(elementFactory),
    };
  }

  private _getStructureJson(painter: Painter) {
    return JSON.stringify(painter.buildStructure());
  }

  private _getElementFactoryJson(elementFactory: ElementFactory) {
    return JSON.stringify(elementFactory);
  }
}
