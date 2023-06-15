import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import detectEthereumProvider from '@metamask/detect-provider'
import { isError } from "@blockchain-lab-um/utils";
import { Masca } from "./snap.js";



export async function verifyAndSetCeramicSession(masca: Masca){
    // Check if there is valid session in Masca
    const api = masca.getMascaApi()
    const session = await api.verifyStoredCeramicSessionKey()
    console.log(session)

    if(!isError(session)){
        return true;
    }

    // Start new session if there is no valid session
    const ethProvider = await detectEthereumProvider()
    if(!ethProvider){
        throw new Error('No Ethereum provider found')
    }
    const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const accountId = await getAccountId(ethProvider, (addresses as string[])[0])
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const authMethod = await EthereumWebAuth.getAuthMethod(window.ethereum, accountId)

    const newSession = await DIDSession.authorize(authMethod, {expiresInSecs: 3600, resources: [`ceramic://*`]});
    const serializedSession = newSession.serialize();
    console.log(serializedSession)
    // Set session in Masca
    const result = await api.setCeramicSessionKey(serializedSession);
    console.log(result);
    if(isError(result)){
        throw new Error('Error setting session in Masca')
    }
    return true;
}