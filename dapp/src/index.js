// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data.payload.replace(/^0x/, "")
  const namespace = '00000000' + payload.substring(64, 64 * 2 - 8)
  const blockHeight = payload.substring(64 * 3, 64 * 4)
  const shareStart = payload.substring(64 * 4, 64 * 5)
  const shareEnd = payload.substring(64 * 5, 64 * 6)
  const gioID = `0x${namespace}${blockHeight}${shareStart}${shareEnd}`
  console.log({
    namespace,
    blockHeight,
    shareStart,
    shareEnd,
    gioID
  })
  const gioRequest = await fetch(rollup_server + "/gio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      domain: 714,
      id: gioID
    }),
  });
  if (gioRequest.status >= 200 && gioRequest.status < 300) {
    const gioRes = await gioRequest.json();
    const buffer = Buffer.from(gioRes.data, 'hex');
    const text = buffer.toString('utf8');
    console.log("GioRes", JSON.stringify({ ...gioRes, text }, null, 4))
  }
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
