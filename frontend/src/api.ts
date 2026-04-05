import type {
  AnalyzeResponse,
  BusinessProfile,
  NaicsResolution,
  QuoteCompareRequestPayload,
  QuoteCompareResponse,
  RiskoChatResponse,
  RiskoMessage,
} from "./types";

const API = "/api";

export async function analyzeBusiness(
  profile: BusinessProfile,
  policyText: string | null,
  useSamplePolicy: boolean,
): Promise<AnalyzeResponse> {
  const res = await fetch(`${API}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile,
      policy_text: policyText || null,
      use_sample_policy: useSamplePolicy,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json() as Promise<AnalyzeResponse>;
}

export async function extractPdfText(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API}/upload-policy`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  const data = (await res.json()) as { text: string };
  return data.text;
}

export async function lookupNaics(code: string): Promise<NaicsResolution> {
  const q = encodeURIComponent(code.trim());
  const res = await fetch(`${API}/naics/lookup?code=${q}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json() as Promise<NaicsResolution>;
}

export async function riskoChat(messages: RiskoMessage[]): Promise<RiskoChatResponse> {
  const res = await fetch(`${API}/risko/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    let err = await res.text();
    try {
      const j = JSON.parse(err) as { detail?: string };
      if (typeof j.detail === "string") err = j.detail;
    } catch {
      /* use raw */
    }
    throw new Error(err || res.statusText);
  }
  return res.json() as Promise<RiskoChatResponse>;
}

export async function submitQuoteCompare(body: QuoteCompareRequestPayload): Promise<QuoteCompareResponse> {
  const res = await fetch(`${API}/quotes/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let err = await res.text();
    try {
      const j = JSON.parse(err) as { detail?: string };
      if (typeof j.detail === "string") err = j.detail;
    } catch {
      /* use raw */
    }
    throw new Error(err || res.statusText);
  }
  return res.json() as Promise<QuoteCompareResponse>;
}
