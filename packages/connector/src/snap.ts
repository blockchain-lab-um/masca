import {
  AvailableMethods,
  SSISnapApi,
} from '@blockchain-lab-um/ssi-snap-types';
import {
  saveVC,
  queryVCs,
  createVP,
  togglePopups,
  changeInfuraToken,
  getDID,
  getSelectedMethod,
  getAvailableMethods,
  switchDIDMethod,
  getVCStore,
  getAvailableVCStores,
  setVCStore,
  deleteVC,
  getSnapSettings,
  getAccountSettings,
} from './methods';

export class MetaMaskSSISnap {
  // snap parameters
  protected readonly snapOrigin: string;
  protected readonly snapId: string;
  public readonly supportedMethods: Array<AvailableMethods>;

  public constructor(
    snapOrigin: string,
    supportedMethods: Array<AvailableMethods>
  ) {
    this.snapOrigin = snapOrigin;
    this.snapId = `wallet_snap_${this.snapOrigin}`;
    this.supportedMethods = supportedMethods;

    window.ethereum.on('accountsChanged', this.accountChanged);
  }

  public accountChanged = (accounts: string[]) => {
    console.log('Account changed', accounts[0]);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  public getSSISnapApi = async (): Promise<SSISnapApi> => {
    return {
      saveVC: saveVC.bind(this),
      queryVCs: queryVCs.bind(this),
      createVP: createVP.bind(this),
      togglePopups: togglePopups.bind(this),
      changeInfuraToken: changeInfuraToken.bind(this),
      getDID: getDID.bind(this),
      getSelectedMethod: getSelectedMethod.bind(this),
      getAvailableMethods: getAvailableMethods.bind(this),
      switchDIDMethod: switchDIDMethod.bind(this),
      getVCStore: getVCStore.bind(this),
      setVCStore: setVCStore.bind(this),
      getAvailableVCStores: getAvailableVCStores.bind(this),
      deleteVC: deleteVC.bind(this),

      getSnapSettings: getSnapSettings.bind(this),
      getAccountSettings: getAccountSettings.bind(this),
    };
  };
}
