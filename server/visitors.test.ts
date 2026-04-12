import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification service
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

import { notifyOwner } from "./_core/notification";

function createPublicContext(ipAddress?: string, userAgent?: string): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {
        "user-agent": userAgent || "Mozilla/5.0 Test Browser",
        ...(ipAddress && { "x-forwarded-for": ipAddress }),
      },
      ip: ipAddress,
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("visitors.trackGiftUnlock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tracks gift unlock and sends email notification", async () => {
    const ctx = createPublicContext("192.168.1.100", "Mozilla/5.0 Test Browser");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitors.trackGiftUnlock();

    expect(result).toEqual({ success: true });
    expect(notifyOwner).toHaveBeenCalledOnce();

    // Verify notification was called with correct structure
    const callArgs = vi.mocked(notifyOwner).mock.calls[0]?.[0];
    expect(callArgs).toBeDefined();
    expect(callArgs?.title).toContain("Mariam unlocked the gift");
    expect(callArgs?.content).toContain("birthday gift was unlocked");
    expect(callArgs?.content).toContain("special surprise");
  });

  it("includes timestamp in unlock notification", async () => {
    const ctx = createPublicContext("192.168.1.100");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitors.trackGiftUnlock();

    expect(result).toEqual({ success: true });
    expect(notifyOwner).toHaveBeenCalledOnce();

    const callArgs = vi.mocked(notifyOwner).mock.calls[0]?.[0];
    expect(callArgs?.content).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Date format check
  });
});

describe("visitors.trackTeaserVisit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tracks teaser visit and sends email notification", async () => {
    const ipAddress = "192.168.1.100";
    const userAgent = "Mozilla/5.0 Test Browser";
    const ctx = createPublicContext(ipAddress, userAgent);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitors.trackTeaserVisit();

    expect(result).toEqual({ success: true });
    expect(notifyOwner).toHaveBeenCalledOnce();

    // Verify notification was called with correct structure
    const callArgs = vi.mocked(notifyOwner).mock.calls[0]?.[0];
    expect(callArgs).toBeDefined();
    expect(callArgs?.title).toContain("Mariam visited the teaser page");
    expect(callArgs?.content).toContain("birthday gift teaser page");
    expect(callArgs?.content).toContain(ipAddress);
    expect(callArgs?.content).toContain("She's waiting for the big reveal");
  });

  it("handles missing IP address gracefully", async () => {
    const ctx = createPublicContext(undefined, "Mozilla/5.0 Test Browser");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitors.trackTeaserVisit();

    expect(result).toEqual({ success: true });
    expect(notifyOwner).toHaveBeenCalledOnce();

    const callArgs = vi.mocked(notifyOwner).mock.calls[0]?.[0];
    expect(callArgs?.content).toContain("Unknown");
  });

  it("includes timestamp in notification", async () => {
    const ctx = createPublicContext("192.168.1.100");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.visitors.trackTeaserVisit();

    expect(result).toEqual({ success: true });
    expect(notifyOwner).toHaveBeenCalledOnce();

    const callArgs = vi.mocked(notifyOwner).mock.calls[0]?.[0];
    expect(callArgs?.content).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Date format check
  });
});
