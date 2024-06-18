import { defineConfig } from "@wagmi/cli"
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";
import { fetch } from "@wagmi/cli/plugins"

export default defineConfig({
    out: "src/rollups.ts",
    plugins: [
        fetch({
            contracts: [
                {
                    name: "CelestiaRelay",
                }
            ],
            async parse({ response }) {
                if (!response.ok) throw new Error(`Failed to fetch contract ABI: ${response.statusText}`)
                const json = await response.json()
                return json?.abi;
            },
            request(contract) {
                const name = (contract as any).name;
                return {
                    url: `https://raw.githubusercontent.com/miltonjonat/rollups-celestia/main/onchain/deployments/sepolia/${name}.json`,
                }
            }
        }),
        hardhatDeploy({
            directory: "../node_modules/@cartesi/rollups/export/abi",
            includes: [
                /IInputBox/,
                /InputBox/,
            ]
        })
    ]
})