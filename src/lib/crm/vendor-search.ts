/**
 * Optional vendor-search module. CallDesk works fully offline.
 * Wire a real provider later via environment variables on the server —
 * never put API keys in the frontend.
 */

export interface VendorSearchResult {
  businessName: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  source?: string;
}

export interface VendorSearchProvider {
  isConfigured(): boolean;
  search(query: string): Promise<VendorSearchResult[]>;
}

class UnconfiguredProvider implements VendorSearchProvider {
  isConfigured() {
    return false;
  }
  async search(_query: string): Promise<VendorSearchResult[]> {
    return [];
  }
}

let provider: VendorSearchProvider = new UnconfiguredProvider();

export function setVendorSearchProvider(next: VendorSearchProvider) {
  provider = next;
}

export function isVendorSearchConfigured(): boolean {
  return provider.isConfigured();
}

export async function searchVendors(query: string): Promise<VendorSearchResult[]> {
  if (!provider.isConfigured()) return [];
  return provider.search(query);
}
