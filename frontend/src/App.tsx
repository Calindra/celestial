import { useState } from "react"
import './App.css'
import celestia from "./assets/celestia.svg"
import cartesi from "./assets/cartesi.svg"

function App() {

  return (
    <>
      <section>
        <h1 className="text-3xl font-bold underline">
          Celestia 2 Cartesi
        </h1>
        <div id="logos" className="flex-1">
          <img className="logo object-cover" src={celestia} />
          <img className="logo object-cover" src={cartesi} />
        </div>
        </section>
    </>
  )
}

export default App
