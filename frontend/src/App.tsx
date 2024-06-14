import { useAccount, useConnect, useDisconnect } from "wagmi"
import './App.css'
import celestia from "./assets/celestia.svg"
import cartesi from "./assets/cartesi.svg"

function App() {
  console.log("App")

  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  // const { data, error, status } = useEnsName({
  //   address,
  // })

  console.log("account", account)

  return (
    <>
      <h1 className="text-3xl font-bold underline">
           Celestia 2 Cartesi
         </h1>
      <h2>Account:</h2>
      <div>
        <p>status: {account.status}</p>
        <p>addresses: {JSON.stringify(account.addresses)}</p>
        <p>chainId: {account.chainId}</p>
        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>Disconnect</button>
        )}
      </div>
      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button key={connector.uid} type="button" onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        ))}
        <div>Status: {status}</div>
        <div>Error: {error?.message}</div>

        <div id="logos" className="flex-1">
           <img className="logo object-cover" src={celestia} />
           <img className="logo object-cover" src={cartesi} />
         </div>
      </div>
    </>
  )
}

export default App
