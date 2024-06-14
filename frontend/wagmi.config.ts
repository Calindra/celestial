import { defineConfig } from "@wagmi/cli"
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";

export default defineConfig({
    out: "src/rollups.ts",
    plugins: [
        hardhatDeploy({
            directory: "../node_modules/@cartesi/rollups/export/abi",
            includes: [
                /InputBox/,
            ]
        })
    ]
})