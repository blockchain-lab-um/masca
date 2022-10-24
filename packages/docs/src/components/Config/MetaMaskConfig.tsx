/* eslint-disable import/order */
import React, { useState, useEffect } from 'react';
import { SSISnapApi } from '@blockchain-lab-um/ssi-snap-types';
import { isMetamaskSnapsSupported } from '@blockchain-lab-um/ssi-snap-connector';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {
  Button,
  TextField,
  Grid,
  ButtonGroup,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { initiateSSISnap } from './snap';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
import styles from './styles.module.css';

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

export default function MetaMaskConfig() {
  const [snapInstalled, setSnapInstalled] = useState(false);
  const [infuraToken, setInfuraToken] = useState('');
  const [success, setSuccess] = useState(false);
  const [snapSupported, setSnapSupported] = useState(false);
  const [api, setApi] = useState<SSISnapApi | undefined>(undefined);
  const [method, setMethod] = useState<string>('');
  const [availableMethods, setAvailableMethods] = useState<Array<string>>([]);
  const [did, setDid] = useState<string>('');
  const [vcStore, setVcStore] = useState<string>('');
  const [availableVCStores, setAvailableVCStores] = useState<Array<string>>([]);

  const { activate, deactivate } = useWeb3React();
  const { account } = useWeb3React();

  let snapID = 'npm:@blockchain-lab-um/ssi-snap';
  const debug = process.env.NODE_ENV !== 'production';
  if (debug) {
    snapID = process.env.SNAP_ID;
  }

  if (ExecutionEnvironment.canUseDOM) {
    useEffect(() => {
      const snapsSupported = async () => {
        setSnapSupported(await isMetamaskSnapsSupported());
      };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      snapsSupported();
    }, []);
  }

  const connectMetamask = async () => {
    await activate(Injected);
    console.log('Metamask connected', account);
    if (window.ethereum) {
      const result = await initiateSSISnap(snapID);
      if (result.isSnapInstalled) {
        setSnapInstalled(true);
        const snapApi = await result.snap?.getSSISnapApi();
        setApi(snapApi);

        setMethod(await snapApi.getMethod());
        setAvailableMethods(await snapApi.getAvailableMethods());
        setDid(await snapApi.getDID());
        setVcStore(await snapApi.getVCStore());
        setAvailableVCStores(await snapApi.getAvailableVCStores());
      }
    }
  };

  async function submitToken() {
    if (infuraToken !== '' && api) {
      const res = await api.changeInfuraToken(infuraToken);
      console.log(res);
      setSuccess(res);
    }
  }
  async function togglePopups() {
    if (api) {
      const res = await api.togglePopups();
      console.log(res);
      setSuccess(res);
    }
  }

  function tokenChange(e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setInfuraToken(e.target.value);
  }
  const methodChange = async (event: SelectChangeEvent) => {
    const res = await api.switchMethod(event.target.value);
    if (res) {
      setMethod(event.target.value);
      setDid(await api.getDID());
    }
  };

  const ceramicChanged = async (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (e.target.value === 'on') {
      await api.setVCStore('ceramic');
    }
    setVcStore(await api.getVCStore());
  };

  if (ExecutionEnvironment.canUseDOM) {
    if (window.ethereum && snapSupported) {
      return (
        <div className={styles.teamCard}>
          <Grid container alignItems="center" spacing={2}>
            {account && (
              <Grid item xs={12}>
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                >
                  <Button
                    variant="outlined"
                    size="large"
                    style={{ backgroundColor: '#e8e8e8', color: '#8349bb' }}
                    onClick={async () => {
                      await navigator.clipboard.writeText(account);
                    }}
                  >{`${account.substring(0, 5)}...${account.substring(
                    38
                  )}`}</Button>
                  <Button
                    variant="outlined"
                    size="large"
                    style={{ backgroundColor: '#e8e8e8', color: '#8349bb' }}
                    onClick={async () => {
                      await navigator.clipboard.writeText(did);
                    }}
                  >{`${did.substring(0, did.lastIndexOf(':'))}:${did
                    .split(':')
                    [did.split(':').length - 1].substring(
                      0,
                      5
                    )}...${did.substring(did.length - 4)}`}</Button>
                  <Button
                    size="small"
                    style={{ textAlign: 'center' }}
                    onClick={() => deactivate()}
                  >
                    Disconnect
                  </Button>
                </ButtonGroup>
              </Grid>
            )}
            {!account && (
              <Grid item xs>
                {' '}
                <Button variant="contained" onClick={connectMetamask}>
                  Connect MetaMask
                </Button>
              </Grid>
            )}
            {account && snapInstalled && (
              <>
                <Grid item xs={12}>
                  <Grid item xs>
                    <Typography variant="h5" sx={{ mb: 1.5 }}>
                      Snap Configuration
                    </Typography>
                  </Grid>
                  <TextField
                    id="standard-basic"
                    label="Infura Token"
                    variant="standard"
                    size="small"
                    color="secondary"
                    style={{
                      backgroundColor: '#e8e8e8',
                    }}
                    onChange={(e) => {
                      tokenChange(e);
                    }}
                  />

                  <Button variant="contained" onClick={() => submitToken()}>
                    Change Infura Token
                  </Button>
                </Grid>
                <Grid item xs>
                  <Button variant="contained" onClick={() => togglePopups()}>
                    Toggle popups
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ mb: 1.5 }}>
                    DID Configuration
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth variant="filled">
                    <InputLabel id="select-did-method-label" color="secondary">
                      DID Method
                    </InputLabel>
                    <Select
                      color="secondary"
                      style={{
                        backgroundColor: '#e8e8e8',
                      }}
                      labelId="select-did-method-label"
                      id="select-did-method"
                      value={method}
                      label="DID Method"
                      onChange={(e) => methodChange(e)}
                    >
                      {availableMethods.map((item, key) => (
                        <MenuItem value={item} key={key}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ mb: 1.5 }}>
                    VC Store Configuration
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={vcStore === 'ceramic'} />}
                      label="Enable Ceramic"
                      onChange={(e) => ceramicChanged(e)}
                    />
                  </FormGroup>
                </Grid>
              </>
            )}
          </Grid>
        </div>
      );
    }
  }
  return <div>Install MetaMask first!</div>;
}
