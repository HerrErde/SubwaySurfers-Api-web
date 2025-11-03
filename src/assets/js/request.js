async function sendRequest(
  url,
  token,
  MsgType,
  RespType,
  body = {},
  opts = {}
) {
  const output = document.getElementById("response-output");
  output.style.display = "none";
  if (!token) {
    alert("Upload JSON first!");
    return;
  }

  const isJson = opts.json === true;
  let headers = { Authorization: "Bearer " + token };
  let requestBody;

  if (isJson) {
    // JSON
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body || {});
  } else {
    // gRPC-Web
    if (typeof MsgType !== "function" || typeof RespType !== "function") {
      alert("MsgType or RespType are not defined for gRPC request!");
      return;
    }

    let payload;
    if (
      MsgType &&
      (MsgType.name === "UpdatePlayerRequest" || /UpdatePlayer/i.test(url))
    ) {
      payload = encodeUpdatePlayerRequest(body);
    } else {
      function fillMessage(msgInstance, obj) {
        for (const k in obj) {
          if (!obj.hasOwnProperty(k)) continue;
          const setter = "set" + k.charAt(0).toUpperCase() + k.slice(1);
          const mapGetter =
            "get" + k.charAt(0).toUpperCase() + k.slice(1) + "Map";
          const addRepeated = "add" + k.charAt(0).toUpperCase() + k.slice(1);
          const val = obj[k];

          if (typeof msgInstance[setter] === "function") {
            if (val && typeof val === "object" && !Array.isArray(val)) {
              try {
                const nestedMsg = msgInstance[setter].prototype?.constructor
                  ? new msgInstance[setter].prototype.constructor()
                  : new msgInstance[setter]();
                fillMessage(nestedMsg, val);
                msgInstance[setter](nestedMsg);
              } catch {
                msgInstance[setter](val);
              }
            } else {
              msgInstance[setter](val);
            }
          } else if (typeof msgInstance[mapGetter] === "function") {
            const map = msgInstance[mapGetter]();
            for (const mapKey in val) map.set(mapKey, val[mapKey]);
          } else if (
            typeof msgInstance[addRepeated] === "function" &&
            Array.isArray(val)
          ) {
            val.forEach((item) => {
              if (item && typeof item === "object") {
                const nestedMsg = new (msgInstance[addRepeated].prototype
                  ?.constructor || Object)();
                fillMessage(nestedMsg, item);
                msgInstance[addRepeated](nestedMsg);
              } else msgInstance[addRepeated](item);
            });
          } else {
            console.warn(`Field ${k} not found on message`);
          }
        }
      }
      const msg = new MsgType();
      fillMessage(msg, body);
      payload = msg.serializeBinary();
    }

    const lenBuf = new Uint8Array(4);
    new DataView(lenBuf.buffer).setUint32(0, payload.length);

    const framedBody = new Uint8Array(1 + 4 + payload.length);
    framedBody[0] = 0;
    framedBody.set(lenBuf, 1);
    framedBody.set(payload, 5);
    requestBody = framedBody;

    headers = {
      ...headers,
      "User-Agent":
        "grpc-dotnet/2.63.0 (Mono Unity; CLR 4.0.30319.17020; netstandard2.0; arm64) com.kiloo.subwaysurf/3.47.0",
      TE: "trailers",
      "grpc-accept-encoding": "identity,gzip",
      "Content-Type": "application/grpc-web"
    };
  }

  try {
    let corsProxy =
      localStorage.getItem("corsProxy") || "https://corsproxy.io/?url=";
    const res = await fetch(corsProxy + url, {
      method: "POST",
      headers,
      body: requestBody
    });

    if (isJson) {
      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid JSON response: " + text);
      }
      output.style.display = "block";
      output.value = JSON.stringify(parsed, null, 2);
      return;
    }

    const grpcStatus = res.headers.get("grpc-status");
    if (grpcStatus && grpcStatus !== "0") {
      const details = res.headers.get("grpc-status-details-bin");
      output.style.display = "block";
      output.value =
        "gRPC Error " + grpcStatus + ":\n" + decodeGrpcStatus(details);
      return;
    }

    const raw = new Uint8Array(await res.arrayBuffer());
    if (raw.length < 5) throw new Error("Response too short");

    const msgLen = new DataView(raw.buffer, 1, 4).getUint32(0);
    const grpcPayload = raw.slice(5, 5 + msgLen);

    const resp = RespType.deserializeBinary(grpcPayload);
    output.style.display = "block";
    output.value = JSON.stringify(resp.toObject(), null, 2);
  } catch (err) {
    console.error("Request failed:", err);
    output.style.display = "block";
    output.value = "Error: " + err.message;
  }
}

// Decode grpc-status-details-bin into readable message
function decodeGrpcStatus(base64str) {
  if (!base64str) return "No grpc-status-details-bin header present.";
  base64str = base64str + "=".repeat((4 - (base64str.length % 4)) % 4);

  try {
    const bytes = Uint8Array.from(atob(base64str), (c) => c.charCodeAt(0));
    const status = proto.google.rpc.Status.deserializeBinary(bytes);
    const out = [
      `Code: ${status.getCode()}`,
      `Message: ${status.getMessage()}`
    ];
    status.getDetailsList().forEach((detail) => {
      out.push(`Detail type: ${detail.getTypeUrl()}`);
    });
    return out.join("\n");
  } catch (e) {
    return "Failed to decode grpc-status-details-bin: " + e.message;
  }
}

const UpdatePlayerSpec = {
  positions: { name: 1, level: 2, highscore: 3, metadata: 4 },
  types: {
    name: "string",
    level: "int32",
    highscore: "int64",
    metadata: "map<string,string>"
  }
};

function encodeUpdatePlayerRequest(obj = {}) {
  const writer = new jspb.BinaryWriter();
  const { positions, types } = UpdatePlayerSpec;

  const writeInt64Safe = (pos, val) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return;
    if (Number.isSafeInteger(n)) writer.writeInt64(pos, n);
    else if (typeof writer.writeInt64String === "function")
      writer.writeInt64String(pos, String(n));
    else writer.writeString(pos, String(n));
  };

  for (const [field, pos] of Object.entries(positions)) {
    const val = obj[field];
    if (val == null) continue;

    switch (types[field]) {
      case "string": {
        const s = String(val).trim();
        if (s !== "") writer.writeString(pos, s);
        break;
      }
      case "int32": {
        const n = Number(val);
        if (Number.isFinite(n)) writer.writeInt32(pos, Math.trunc(n));
        break;
      }
      case "int64":
        writeInt64Safe(pos, val);
        break;
      default: // map<string,string>
        if (typeof val === "object") {
          for (const [k, vRaw] of Object.entries(val)) {
            const v =
              vRaw != null && typeof vRaw === "object"
                ? JSON.stringify(vRaw)
                : String(vRaw);
            writer.writeMessage(pos, { key: k, value: v }, (entry, w) => {
              w.writeString(1, entry.key);
              w.writeString(2, entry.value);
            });
          }
        }
    }
  }

  return writer.getResultBuffer();
}
