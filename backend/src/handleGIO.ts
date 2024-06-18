import { decodeFunctionData } from "viem";
import { Buffer } from "node:buffer";
import type { AdvanceRequestHandler } from ".";

export type HandlerGio = (...args: Parameters<AdvanceRequestHandler>) => Promise<string>;

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
  const { args: [namespace, blockHeight, shareStart, shareEnd] } = decodeFunctionData({
    abi: celestiaAbi,
    data: data.payload
  });

  const gioID = "0x";

  console.log({
    namespace,
    blockHeight,
    shareStart,
    shareEnd,
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

  const buffer = Buffer.from(gioRes.data, "hex");
  const text = buffer.toString("utf-8");
  const output = JSON.stringify({
    ...gioRes,
    text,
  }, null, 4);
  return output;
};
