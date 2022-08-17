import { create_vp } from "../utils/veramo_utils";
import { VerifiablePresentation } from "@veramo/core";

export async function getVP(
  vc_id: string,
  domain?: string,
  challenge?: string
): Promise<VerifiablePresentation | null> {
  if (vc_id === "") throw new Error("vc_id is empty");
  const vp = await create_vp(vc_id, challenge, domain);
  return vp;
}
