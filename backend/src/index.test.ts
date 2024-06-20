import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import createClient from "openapi-fetch";
import type { components, paths } from "./schema"
import { afterEach, beforeAll, describe, it, afterAll, expect } from "vitest"
import { fetchAndDecodeData, celestiaRelayInputBox } from "./handleGIO";
import { encodeFunctionData, pad, stringToHex } from "viem";

describe("index", () => {
    const server = setupServer();

    beforeAll(() => server.listen({
        onUnhandledRequest: (req) => {
            `Received an unhandled request: ${req.method} ${req.url}`
        }
    }));

    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it("should handle advance request", async (ctx) => {
        const baseUrl = "http://localhost:3000";
        const exampleStr = "CartesiRocksCelestia";

        const namespace = pad(stringToHex(exampleStr), { size: 32, dir: "left" });
        const dataRoot = pad("0x1234", { size: 32, dir: "left" });
        const height = BigInt(1);
        const start = BigInt(2);
        const end = BigInt(3);

        const celestia = encodeFunctionData({
            abi: celestiaRelayInputBox,
            args: [namespace, dataRoot, height, start, end],
        });

        console.log("celestia payload", celestia);

        const { POST } = createClient<paths>({
            baseUrl,
        });
        const data: components["schemas"]["Advance"] = {
            metadata: {} as any,
            payload: celestia,
        }
        const responseGIO: components["schemas"]["GioResponse"] = {
            code: 200,
            data: stringToHex("CelestiaWin")
        }
        const errGIO: components["schemas"]["Error"] = "Oh no this is an error"

        let once = true;

        server.use(http.post(`${baseUrl}/gio`, async () => {
            if (once) {
                once = false;
                return HttpResponse.json(responseGIO, { status: 200 });
            }

            return HttpResponse.text(errGIO, { status: 400 });
        }
        ));

        await expect(fetchAndDecodeData(data, POST).then(x => JSON.parse(x))).resolves.toEqual(expect.objectContaining(responseGIO));
    });
})