import { getCurrentMethod } from '../../utils/didUtils';

export async function getMethod(): Promise<string> {
  return await getCurrentMethod();
}
