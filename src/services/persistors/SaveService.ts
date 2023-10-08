import { ElementFactory } from "../../factories/ElementFactory";
import { Painter } from "../../models/painters/Painter";
import { METADATA_FACTORY, METADATA_STRUCTURE } from "../../utils/Constants";
import { addMetadataToBase64DataURI } from "../../utils/ImageUtils";

export class SaveService {
  private _painter: Painter;
  private _elementFactory: ElementFactory;

  constructor(painter: Painter, elementFactory: ElementFactory) {
    this._painter = painter;
    this._elementFactory = elementFactory;
  }

  public buildPngWithMetadata() {
    const dataUri = this._painter.toDataURI();

    const structureMetadata = this._getStructureJson(this._painter);
    const elementFactoryMetadata = this._getElementFactoryJson(
      this._elementFactory
    );

    const taggedDataUri1 = addMetadataToBase64DataURI(
      dataUri,
      METADATA_STRUCTURE,
      structureMetadata
    );
    const taggedDataUri2 = addMetadataToBase64DataURI(
      taggedDataUri1,
      METADATA_FACTORY,
      elementFactoryMetadata
    );

    return taggedDataUri2;
  }

  private _getStructureJson(painter: Painter) {
    return JSON.stringify(painter.buildStructure());
  }

  private _getElementFactoryJson(elementFactory: ElementFactory) {
    return JSON.stringify(elementFactory);
  }
}
