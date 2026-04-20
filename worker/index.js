const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Grpc-Web, X-User-Agent, Connect-Protocol-Version",
  "Access-Control-Expose-Headers":
    "Grpc-Status, Grpc-Message, Grpc-Status-Details-Bin"
};

function withCors(response) {
  const headers = new Headers(response.headers);

  for (const [k, v] of Object.entries(corsHeaders)) {
    headers.set(k, v);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      const ip = request.headers.get("CF-Connecting-IP") || "unknown";

      const { success } = await env.MY_RATE_LIMITER.limit({ key: ip });

      if (!success) {
        return withCors(new Response("Too Many Requests", { status: 429 }));
      }

      const url = new URL(request.url);
      const target = url.searchParams.get("url");

      if (!target) {
        return withCors(new Response("Missing target URL", { status: 400 }));
      }

      let targetUrl;
      try {
        targetUrl = new URL(target);
      } catch {
        return withCors(new Response("Invalid url", { status: 400 }));
      }

      const allowedHosts = ["subway.prod.sybo.net", "subwaycity.prod.sybo.net"];

      if (!allowedHosts.includes(targetUrl.hostname)) {
        return withCors(new Response("Forbidden", { status: 403 }));
      }

      const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body:
          request.method === "GET" || request.method === "HEAD"
            ? null
            : request.body,
        redirect: "follow"
      });

      const upstreamResponse = await fetch(proxyRequest);

      return withCors(new Response(upstreamResponse.body, upstreamResponse));
    } catch (err) {
      return withCors(new Response("Internal Server Error", { status: 500 }));
    }
  }
};
