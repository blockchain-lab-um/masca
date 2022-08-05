import { create_vp } from "../utils/veramo_utils";

export async function getVP(vc_id: string, domain: string, challenge: string) {
  if (vc_id) {
    const vp = await create_vp(vc_id, challenge, domain);
    return { data: vp };
  } else {
    console.log("Missing parameters: vc_id");
    return { error: "Missing parameter: vc_id" };
  }
}
