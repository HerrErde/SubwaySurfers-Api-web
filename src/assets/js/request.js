async function sendRequest(
  url,
  token,
  MsgType,
  RespType,
  body = null,
  opts = {}
) {
  const output = document.getElementById("response-output");
  output.style.display = "none"; // hide before request

  if (!token) {
    alert("Upload JSON first!");
    return;
  }

  const isJson = opts.json === true;

  let headers = {
    Authorization: "Bearer " + token
  };
  let requestBody;

  if (isJson) {
    // JSON
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body || {});
  } else {
    // gRPC-Web
    if (typeof MsgType !== "function" || typeof RespType !== "function") {
      alert(
        "MsgType und/oder RespType sind für gRPC-Requests nicht definiert!"
      );
      return;
    }
    let msg = new MsgType();

    for (const k in body) {
      const setter = "set" + k.charAt(0).toUpperCase() + k.slice(1);
      if (typeof msg[setter] === "function") {
        msg[setter](body[k]);
      }
    }
    const payload = msg.serializeBinary();

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
    const res = await fetch("https://corsproxy.io/?url=" + url, {
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
      const decoded = decodeGrpcStatus(details);
      output.style.display = "block";
      output.value = "gRPC Error " + grpcStatus + ":\n" + decoded;
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
    let out = [`Code: ${status.getCode()}`, `Message: ${status.getMessage()}`];

    const detailsList = status.getDetailsList();
    detailsList.forEach((detail) => {
      const anyMsg = detail;
      out.push(`Detail type: ${anyMsg.getTypeUrl()}`);
    });

    return out.join("\n");
  } catch (e) {
    return "Failed to decode grpc-status-details-bin: " + e.message;
  }
}
