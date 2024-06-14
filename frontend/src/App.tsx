import { useAccount, useConnect, useDisconnect, useWriteContract } from "wagmi"
import './App.css'
import celestia from "./assets/celestia.svg"
import cartesi from "./assets/cartesi.svg"
import { inputBoxAbi } from "./rollups"
import type { MouseEventHandler } from "react"
import { stringToHex } from "viem"
// import { InputBox__factory } from "@cartesi/rollups"

const INPUT_BOX_ADDR = "0x58Df21fE097d4bE5dCf61e01d9ea3f6B81c2E1dB"
const DAPP_ADDR = "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContract } = useWriteContract();


  // const callInputbox = async (payhex: `0x${string}`) => {
  //   const ipt = InputBox__factory.connect(inputBoxAddress);
  //   const result = await ipt.addInput(DAPP_ADDR, payhex);
  //   console.log({ result });
  // }

  const handleInputBox: MouseEventHandler = (event ) => {
    event.preventDefault();

    const payload = {
      hello: "celestia"
    }

    const payhex = stringToHex(JSON.stringify(payload));

    console.log("Payload", {payload, payhex})

    // callInputbox(payhex).catch(console.error)
    writeContract({
      abi: inputBoxAbi,
      address: INPUT_BOX_ADDR,
      functionName: "addInput",
      args: [DAPP_ADDR, payhex],
    })
  }

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
        <h2 className="text-2xl font-bold underline">Connect</h2>
        {connectors.map((connector) => (
          <button key={connector.uid} type="button" onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        ))}
        <div>Status: {status}</div>
        <div>Error: {error?.message}</div>

        {account.isConnected && <div>
          <button onClick={handleInputBox} type="button">Call inputbox</button>
        </div>}

        <div id="logos" className="flex-1">
           <img className="logo object-cover" src={celestia} />
           <img className="logo object-cover" src={cartesi} />
         </div>
      </div>
    </>
  )
}

export default App
