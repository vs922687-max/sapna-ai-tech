// DigiLocker / eSign / CSC integration-ready adapters.
// All methods currently return a graceful `pending_integration` result so UI can
// wire the flows now and swap the implementation once official APIs are enabled.
export type IntegrationResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; code: "pending_integration" | "not_configured" | "network" | "denied" };

const pending = <T = never>(feature: string): IntegrationResult<T> => ({
  ok: false,
  error: `${feature} integration will activate once the official API is enabled.`,
  code: "pending_integration",
});

export const DigiLocker = {
  isConfigured() { return false; },
  async listDocuments(): Promise<IntegrationResult<{ id: string; name: string; issuer: string }[]>> {
    return pending("DigiLocker");
  },
  async importDocument(_id: string): Promise<IntegrationResult<{ url: string }>> {
    return pending("DigiLocker");
  },
  async refresh(): Promise<IntegrationResult<{ synced: number }>> {
    return pending("DigiLocker");
  },
  async verify(_id: string): Promise<IntegrationResult<{ verified: boolean }>> {
    return pending("DigiLocker");
  },
};

export const eSign = {
  isConfigured() { return false; },
  async requestAadhaarESign(_docId: string, _consent: boolean): Promise<IntegrationResult<{ signId: string }>> {
    return pending("Aadhaar eSign");
  },
  async requestDSC(_docId: string): Promise<IntegrationResult<{ signId: string }>> {
    return pending("DSC (Digital Signature)");
  },
  async verify(_signId: string): Promise<IntegrationResult<{ valid: boolean }>> {
    return pending("Signature verification");
  },
};

export const CSC = {
  isConfigured() { return false; },
  async listServices(): Promise<IntegrationResult<{ id: string; name: string; commission?: number }[]>> {
    return pending("CSC");
  },
  async submitTransaction(_serviceId: string, _payload: unknown): Promise<IntegrationResult<{ txnId: string }>> {
    return pending("CSC");
  },
};
