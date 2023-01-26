import MetaMaskGateway from '../../components/MetaMaskGateway';

export default function Dashboard() {
  // useEffect(() => {
  //   console.log('Has metamask', hasMetaMask());
  // }, []);

  return (
    <MetaMaskGateway>
      <h1>Hello world from dashboard</h1>
    </MetaMaskGateway>
  );
}
