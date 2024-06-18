// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import { decodeFunctionData } from "viem"
import { Buffer } from "node:buffer"

const celestiaAbi = [
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

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<void>;
type AdvanceRequestHandler = (
  data: AdvanceRequestData
) => Promise<RequestHandlerResult>;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));

  try {
    const { POST } = createClient<paths>({ baseUrl: rollupServer });

    const { args: [namespace, blockHeight, shareStart, shareEnd] } = decodeFunctionData({
      abi: celestiaAbi,
      data: data.payload
    })

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
    console.log("GioRes", output);

  } catch (e) {
    console.error("Error: " + e);
  }

  return "accept";
};

const handleInspect: InspectRequestHandler = async (data) => {
  console.log("Received inspect request data " + JSON.stringify(data));
};

const main = async () => {
  const { POST } = createClient<paths>({ baseUrl: rollupServer });
  let status: RequestHandlerResult = "accept";
  while (true) {
    const { response } = await POST("/finish", {
      body: { status },
      parseAs: "text",
    });

    if (response.status === 200) {
      const data = (await response.json()) as RollupsRequest;
      switch (data.request_type) {
        case "advance_state":
          status = await handleAdvance(data.data as AdvanceRequestData);
          break;
        case "inspect_state":
          await handleInspect(data.data as InspectRequestData);
          break;
      }
    } else if (response.status === 202) {
      console.log(await response.text());
    }
  }
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
