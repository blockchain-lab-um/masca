import { agent } from "./setup";

export async function create_vp(vc_id: number) {
  //get identifier
  const identifiers = await agent.didManagerFind();
  let identifier: string = "";
  if (identifiers.length > 0) {
    identifiers.map((id) => {
      console.log(id.did);
      identifier = id.did;
      console.log("..................");
    });

    const vc = await agent.getVC({ id: vc_id });
    console.log(vc);

    const vp = await agent.createVerifiablePresentation({
      presentation: {
        holder: identifier,
        verifier: [],
        verifiableCredential: [vc],
      },
      proofFormat: "jwt",
      save: true,
    });
    console.log("....................VP..................");
    console.log(vp);
    return vp;
  }
}
