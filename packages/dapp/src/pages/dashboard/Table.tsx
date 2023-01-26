/* eslint-disable @typescript-eslint/no-misused-promises */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import Button from 'src/components/Button';
import { useSnapStore, useGeneralStore } from '../../utils/store';

export const Table = () => {
  const vcs = useSnapStore((state) => state.vcs);
  const changeVcs = useSnapStore((state) => state.changeVcs);
  const api = useSnapStore((state) => state.snapApi);

  const loadVCs = async () => {
    const loadedVCs = await api?.queryVCs();
    console.log(loadedVCs);
    if (loadedVCs) {
      changeVcs(loadedVCs);
    }
  };

  const handleLoadVcs = async () => {
    await loadVCs();
  };

  if (vcs.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-full ">
        Load VCs to get Started!
        <Button className="btn-primary-sm mt-4" onClick={handleLoadVcs}>
          Load VCs
        </Button>
      </div>
    );
  return <>Table</>;
};
