import { agent } from "./setup";

export async function create_ids() {
  const identity = await agent.didManagerCreate();
  console.log(`New identity created`);
  console.log(identity);
}
