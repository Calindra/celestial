import { decodeFunctionData, encodeFunctionData, slice, stringToHex } from "viem";
import type { AdvanceRequestHandler } from ".";
import { celestiaRelayAbi } from "./rollups";

export type HandlerGio = (...args: Parameters<AdvanceRequestHandler>) => Promise<string>;

export const celestiaRelayInputBox = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "namespace",
        "type": "bytes32" // bytes29
      },
      {
        "name": "dataRoot",
        "type": "bytes32"
      },
      {
        "name": "blockHeight",
        "type": "uint256"
      },
      {
        "name": "start",
        "type": "uint256"
      },
      {
        "name": "end",
        "type": "uint256"
      }
    ],
    "name": "CelestiaRelay",
    "outputs": [
      {
        "name": "",
        "type": "bytes"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  }
] as const


export const celestiaAbi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "namespace",
        "type": "bytes29"
      },
      {
        "name": "height",
        "type": "uint256"
      },
      {
        "name": "start",
        "type": "uint256"
      },
      {
        "name": "end",
        "type": "uint256"
      }
    ],
    "name": "CelestiaRequest",
    "outputs": [
      {
        "name": "",
        "type": "bytes"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  }
] as const

export const fetchAndDecodeData: HandlerGio = async (data, POST) => {
  try {
    const { args: [namespaceFull, _dataRoot, blockHeight, shareStart, shareEnd] } = decodeFunctionData({
      abi: celestiaRelayInputBox,
      data: data.payload
    });

    console.log({
      namespaceFull,
      blockHeight,
      shareStart,
      shareEnd,
    });

    const namespace = slice(namespaceFull, -29);

    const gioID = encodeFunctionData({
      abi: celestiaAbi,
      args: [namespace, blockHeight, shareStart, shareEnd]
    });

    console.log({
      gioID
    });

    const { data: gioRes, error } = await POST("/gio", {
      body: {
        domain: 714,
        id: gioID,
      },
      parseAs: "json",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (error || !gioRes) {
      throw new Error(error ?? "Gio request failed");
    }

    const text = stringToHex(gioRes.data)
    const output = JSON.stringify({
      ...gioRes,
      text,
    }, null, 4);
    return output;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
