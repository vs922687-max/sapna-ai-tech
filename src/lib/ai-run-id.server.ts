const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createAiRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      const response = await fetch(input, { ...init, headers });
      runId ??= response.headers.get(RUN_ID_HEADER)?.trim() || undefined;
      return response;
    },
  };
}

export function incomingAiRunId(request: Request) {
  return request.headers.get(RUN_ID_HEADER)?.trim() || undefined;
}

export function aiResponseHeaders(source: Headers, contentType?: string) {
  const headers = new Headers({
    "Content-Type": contentType ?? source.get("Content-Type") ?? "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
  });
  source.forEach((value, name) => {
    if (name.toLowerCase().startsWith("x-lovable-aig-")) headers.set(name, value);
  });
  return headers;
}