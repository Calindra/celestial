import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import createClient from "openapi-fetch";
import type { components, paths } from "./schema"
import { afterEach, before, describe, it, after } from "node:test"
import assert from 'node:assert';
import { fetchAndDecodeData, celestiaRelayInputBox } from "./handleGIO";
import { encodeFunctionData, pad, stringToHex } from "viem";

describe("index", () => {
    const server = setupServer();

    before(() => server.listen({
        onUnhandledRequest: (req) => {
            `Received an unhandled request: ${req.method} ${req.url}`
        }
    }));

    afterEach(() => server.resetHandlers());
    after(() => server.close());

    it("should handle advance request", async () => {
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

        let result: object = {};

        const call = async () => {
            const decoded = await fetchAndDecodeData(data, POST);
            result = JSON.parse(decoded);
            return result;
        }
        await assert.doesNotReject(call);
        assert.ok("data" in result, "data key is missing");
        assert.strictEqual(result.data, responseGIO.data, "data is not equal");
        assert.ok("code" in result, "code key is missing");
        assert.strictEqual(result.code, responseGIO.code, "code is not equal");
    });
})