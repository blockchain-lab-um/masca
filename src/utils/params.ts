import { VCQuerry } from "@blockchain-lab-um/ssi-snap-types";
import { VerifiableCredential } from "@veramo/core";
import { availableMethods } from "../did/did-methods";

export function isValidGetVCsRequest(
  params: unknown
): asserts params is { querry?: VCQuerry } {
  if (!(params != null && typeof params == "object" && "querry" in params)) {
    throw new Error("Invalid GetVCs request");
  }
}

export function isValidSaveVCRequest(
  params: unknown
): asserts params is { verifiableCredential: VerifiableCredential } {
  if (
    !(
      params != null &&
      typeof params == "object" &&
      "verifiableCredential" in params
    )
  ) {
    throw new Error("Invalid SaveVC request");
  }
}

export function isValidGetVPRequest(
  params: unknown
): asserts params is { vc_id: string; domain?: string; challenge?: string } {
  if (!(params != null && typeof params == "object" && "vc_id" in params)) {
    throw new Error("Invalid GetVP request");
  }
}

export function isValidChangeInfuraTokenRequest(
  params: unknown
): asserts params is { infuraToken: string } {
  if (
    !(params != null && typeof params == "object" && "infuraToken" in params)
  ) {
    throw new Error("Invalid ChangeInfuraToken request");
  }
}

export function isValidSwitchMethodRequest(
  params: unknown
): asserts params is { didMethod: typeof availableMethods[number] } {
  if (!(params != null && typeof params == "object" && "didMethod" in params)) {
    throw new Error(
      "Invalid switchMethod request. DID method likely not supported"
    );
  }
}
