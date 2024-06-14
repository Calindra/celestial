//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CartesiDAppFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cartesiDAppFactoryAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'consensus',
        internalType: 'contract IConsensus',
        type: 'address',
        indexed: true,
      },
      {
        name: 'dappOwner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'templateHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'application',
        internalType: 'contract CartesiDApp',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ApplicationCreated',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_consensus',
        internalType: 'contract IConsensus',
        type: 'address',
      },
      { name: '_dappOwner', internalType: 'address', type: 'address' },
      { name: '_templateHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'calculateApplicationAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_consensus',
        internalType: 'contract IConsensus',
        type: 'address',
      },
      { name: '_dappOwner', internalType: 'address', type: 'address' },
      { name: '_templateHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'newApplication',
    outputs: [
      { name: '', internalType: 'contract CartesiDApp', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_consensus',
        internalType: 'contract IConsensus',
        type: 'address',
      },
      { name: '_dappOwner', internalType: 'address', type: 'address' },
      { name: '_templateHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'newApplication',
    outputs: [
      { name: '', internalType: 'contract CartesiDApp', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
] as const

export const cartesiDAppFactoryAddress =
  '0x7122cd1221C20892234186facfE8615e6743Ab02' as const

export const cartesiDAppFactoryConfig = {
  address: cartesiDAppFactoryAddress,
  abi: cartesiDAppFactoryAbi,
} as const
