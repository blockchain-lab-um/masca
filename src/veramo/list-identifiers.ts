import { agent } from "./setup";

export async function list_ids() {
  const identifiers = await agent.didManagerFind();

  console.log(`There are ${identifiers.length} identifiers`);

  if (identifiers.length > 0) {
    identifiers.map((id) => {
      console.log(id);
      console.log("..................");
    });
  }
  return identifiers;
}
