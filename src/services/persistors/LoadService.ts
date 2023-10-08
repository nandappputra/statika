import { ElementFactory } from "../../factories/ElementFactory";
import { Structure } from "../../models/Structure";
import { Painter } from "../../models/painters/Painter";
import { METADATA_FACTORY, METADATA_STRUCTURE } from "../../utils/Constants";
import { getMetadataFromBase64DataURI } from "../../utils/ImageUtils";

export class LoadService {
  private _painter: Painter;
  private _elementFactory: ElementFactory;

  constructor(painter: Painter, elementFactory: ElementFactory) {
    this._painter = painter;
    this._elementFactory = elementFactory;
  }

  public loadState(dataUri: string) {
    const structureMetadata = getMetadataFromBase64DataURI(
      dataUri,
      METADATA_STRUCTURE
    );
    const factoryMetadata = getMetadataFromBase64DataURI(
      dataUri,
      METADATA_FACTORY
    );

    if (!structureMetadata || !factoryMetadata) {
      throw new Error("Invalid file");
    }

    const structure = Structure.fromJson(
      JSON.parse(structureMetadata) as object
    );
    this._painter.loadStructure(structure);

    this._elementFactory.loadStateFromJson(
      JSON.parse(factoryMetadata) as object
    );
  }
}
