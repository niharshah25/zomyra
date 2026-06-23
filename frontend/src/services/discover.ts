import { fakeNetwork } from "./api";
import { MOCK_PROFILES, type DiscoverProfile } from "@/src/lib/discover/mock";

export const discoverService = {
  async list(): Promise<DiscoverProfile[]> {
    return fakeNetwork(MOCK_PROFILES);
  },

  async pass(_profileId: string) {
    return fakeNetwork({ ok: true });
  },

  async connect(_profileId: string) {
    return fakeNetwork({ ok: true });
  },
};
