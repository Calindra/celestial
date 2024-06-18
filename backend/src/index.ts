// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
import createClient from "openapi-fetch";
import type { components, paths } from "./schema";
import { fetchAndDecodeData } from "./handleGIO";



type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<void>;
export type AdvanceRequestHandler = (
  data: AdvanceRequestData,
  POST: (ReturnType<typeof createClient<paths>>["POST"]),
) => Promise<RequestHandlerResult>;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

export const handleAdvance: AdvanceRequestHandler = async (data, POST) => {
  console.log("Received advance request data " + JSON.stringify(data));

  try {
    const output = await fetchAndDecodeData(data, POST);
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
          status = await handleAdvance(data.data as AdvanceRequestData, POST);
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
  console.error(e);
  process.exit(1);
});
