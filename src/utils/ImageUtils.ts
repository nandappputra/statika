import * as metaPNG from "meta-png";
import { dataUriToBuffer } from "data-uri-to-buffer";

export function addMetadataToBase64DataURI(
  dataURI: string,
  key: string,
  value: string
) {
  return metaPNG.addMetadataFromBase64DataURI(dataURI, key, value);
}

export function getMetadataFromBase64DataURI(dataURI: string, key: string) {
  const buffer = dataUriToBuffer(dataURI);
  const uint8Array = new Uint8Array(buffer.buffer);

  return metaPNG.getMetadata(uint8Array, key);
}
