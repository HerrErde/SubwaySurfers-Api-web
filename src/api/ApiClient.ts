import { useAppStore } from "../stores/app";
import type { ApiKind } from "./types";
import type { Endpoint } from "../stores/app";
import { frameMessage, deframeMessage } from "./utils/protobuf";
import { resolveProtoType } from "./utils/registry";
import { Message } from "@bufbuild/protobuf";

const BASE_URLS: Record<ApiKind, string> = {
  SS: "https://subway.prod.sybo.net",
  SSC: "https://subwaycity.prod.sybo.net"
};

export class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public async request(
    logicalEndpoint: Endpoint,
    options: {
      pathParams?: Record<string, string>;
      body?: any;
    } = {}
  ) {
    const store = useAppStore();
    const apiKind = store.apiKind || "SS";
    const baseUrl = BASE_URLS[apiKind];

    const endpoint = logicalEndpoint;

    let url = `${baseUrl}${endpoint.endpoint}`;

    // Path Parameter Interpolation
    if (options.pathParams) {
      Object.entries(options.pathParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, encodeURIComponent(value));
      });
    }

    const headers: Record<string, string> = {
      "Content-Type":
        endpoint.type === "rpc"
          ? "application/grpc-web+proto"
          : "application/json"
    };
    const requestType = endpoint.requestType;
    const responseType = endpoint.responseType;

    if (endpoint.type === "rpc") {
      headers["Accept"] = "application/grpc-web+proto";
      headers["X-Grpc-Web"] = "1";
    }

    if (store.identityToken) {
      headers["Authorization"] = `Bearer ${store.identityToken}`;
    }

    let body: any = options.body;

    // Protobuf Handling
    if (endpoint.type === "rpc") {
      if (body instanceof Message) {
        body = frameMessage(body);
      } else if (requestType && typeof body === "object") {
        const RequestClass =
          typeof requestType === "string"
            ? resolveProtoType(apiKind, requestType)
            : requestType;
        const msg = new RequestClass(body);
        body = frameMessage(msg);
      }
    } else if (typeof body === "object" && body !== null) {
      body = JSON.stringify(body, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      );
    }

    // CORS Proxy
    const finalUrl = store.corsProxy ? `${store.corsProxy}${url}` : url;

    const response = await fetch(finalUrl, {
      method: endpoint.method,
      headers,
      body: endpoint.method === "GET" ? undefined : body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    let result: any;
    if (endpoint.type === "rpc") {
      const contentType = response.headers.get("content-type") || "";
      const buffer = contentType.includes("application/grpc-web-text")
        ? decodeGrpcWebText(await response.text())
        : new Uint8Array(await response.arrayBuffer());
      const deframed = await deframeMessage(
        buffer,
        response.headers.get("grpc-encoding")
      );
      if (responseType) {
        const ResponseClass =
          typeof responseType === "string"
            ? resolveProtoType(apiKind, responseType)
            : responseType;
        result = ResponseClass.fromBinary(deframed).toJson();
      } else {
        result = deframed;
      }
    } else {
      result = await response.json();
    }

    return result;
  }
}

function decodeGrpcWebText(input: string): Uint8Array {
  const normalized = input.replace(/\s+/g, "");

  if (typeof atob !== "function") {
    throw new Error(
      "grpc-web-text decoding is not supported in this environment"
    );
  }

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
