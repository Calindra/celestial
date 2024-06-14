import { http, createConfig } from 'wagmi'
import { anvil } from 'wagmi/chains'

export const config = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
    // [sepolia.id]: http(),
  },
})