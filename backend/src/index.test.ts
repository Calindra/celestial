import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import createClient from "openapi-fetch";
import type { components, paths } from "./schema"
import { afterEach, beforeAll, describe, it, assert, afterAll, expect } from "vitest"
import { fetchAndDecodeData } from "./handleGIO";


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
        const { POST } = createClient<paths>({
            baseUrl,
        });
        const data: components["schemas"]["Advance"] = {
            metadata: {} as any,
            payload: "0x1234"
        }

        let once = true;

        server.use(http.post(`${baseUrl}/gio`, async () => {
            if (once) {
                once = false;
                return HttpResponse.json(data, { status: 200 });
            }

            return HttpResponse.text("No pending", { status: 202 });
        }
        ));

        expect(fetchAndDecodeData(data, POST)).rejects.toThrowError();
        // const result = await fetchAndDecodeData(data, POST);
        // assert.equal(result, "accept");
    });
})