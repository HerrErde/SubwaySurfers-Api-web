import { Message } from "@bufbuild/protobuf";

/**
 * Frames a protobuf message for gRPC-web.
 * Framing adds a 5-byte header:
 * - 1 byte for compressed-flag (0 for uncompressed)
 * - 4 bytes for message length (big-endian)
 */
export function frameMessage(message: Message): Uint8Array {
  const binary = message.toBinary();
  const framed = new Uint8Array(5 + binary.length);

  // Set flag to 0 (uncompressed)
  framed[0] = 0;

  // Set length (big-endian)
  const len = binary.length;
  framed[1] = (len >> 24) & 0xff;
  framed[2] = (len >> 16) & 0xff;
  framed[3] = (len >> 8) & 0xff;
  framed[4] = len & 0xff;

  // Set payload
  framed.set(binary, 5);

  return framed;
}

/**
 * Deframes a gRPC-web response.
 * Extracts the payload from the 5-byte header.
 */
export async function deframeMessage(
  data: Uint8Array,
  grpcEncoding?: string | null,
): Promise<Uint8Array> {
  if (data.length < 5) {
    throw new Error("Response too short to contain gRPC-web header");
  }

  let offset = 0;
  let trailers: Record<string, string> = {};

  while (offset + 5 <= data.length) {
    const flag = data[offset];
    const len =
      (data[offset + 1] << 24) |
      (data[offset + 2] << 16) |
      (data[offset + 3] << 8) |
      data[offset + 4];

    const frameEnd = offset + 5 + len;
    if (data.length < frameEnd) {
      throw new Error(
        `Response length ${data.length} is less than framed length ${frameEnd}`,
      );
    }

    const payload = data.slice(offset + 5, frameEnd);

    if ((flag & 0x80) === 0x80) {
      trailers = parseTrailers(payload);
    } else {
      if ((flag & 0x01) === 0x01) {
        return decompressMessage(payload, grpcEncoding);
      }
      return payload;
    }

    offset = frameEnd;
  }

  const grpcStatus = trailers["grpc-status"];
  if (grpcStatus && grpcStatus !== "0") {
    const grpcMessage = trailers["grpc-message"];
    throw new Error(
      grpcMessage
        ? `gRPC Error ${grpcStatus}: ${decodeURIComponent(grpcMessage)}`
        : `gRPC Error ${grpcStatus}`,
    );
  }

  return new Uint8Array(0);
}

async function decompressMessage(
  payload: Uint8Array,
  grpcEncoding?: string | null,
): Promise<Uint8Array> {
  const encoding = (grpcEncoding || "gzip").trim().toLowerCase();

  if (encoding === "identity") {
    return payload;
  }

  if (typeof DecompressionStream === "undefined") {
    throw new Error(
      `Compressed gRPC response uses unsupported encoding: ${encoding}`,
    );
  }

  let format = encoding;
  if (encoding === "x-gzip") {
    format = "gzip";
  }

  if (!["gzip", "deflate"].includes(format)) {
    throw new Error(
      `Compressed gRPC response uses unsupported encoding: ${encoding}`,
    );
  }

  const buffer = payload.buffer.slice(
    payload.byteOffset,
    payload.byteOffset + payload.byteLength,
  ) as ArrayBuffer;
  const stream = new Blob([buffer])
    .stream()
    .pipeThrough(new DecompressionStream(format as "gzip" | "deflate"));

  try {
    const decompressedBuffer = await new Response(stream).arrayBuffer();
    return new Uint8Array(decompressedBuffer);
  } catch (error) {
    // Some endpoints report grpc-encoding even when the payload is already usable.
    // Falling back keeps valid protobuf responses from being discarded by a
    // browser-side decompression error such as "premature EOF".
    console.warn(
      `Failed to decompress gRPC payload with ${encoding}, falling back to raw bytes.`,
      error,
    );
    return payload;
  }
}

function parseTrailers(data: Uint8Array): Record<string, string> {
  const text = new TextDecoder().decode(data);
  const trailers: Record<string, string> = {};

  text
    .split("\r\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) {
        return;
      }

      const key = line.slice(0, separatorIndex).trim().toLowerCase();
      const value = line.slice(separatorIndex + 1).trim();
      trailers[key] = value;
    });

  return trailers;
}
