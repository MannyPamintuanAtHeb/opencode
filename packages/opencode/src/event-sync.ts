// Temporary V2 projector adapter: session events now live in core, while
// opencode's legacy projector API still accepts SyncEvent-shaped definitions.
// Keep this pure; delete it when projectors operate on core EventV2 definitions
// directly or when the session.next projector path is removed.
import { SyncEvent } from "@/sync"
import { Event } from "@opencode-ai/core/event"
import { Schema } from "effect"

export function definition<D extends Event.Definition>(event: D): SyncEvent.Definition<D["type"], D["schema"]> {
  return {
    type: event.type,
    version: event.version ?? 1,
    aggregate: event.aggregate ?? "sessionID",
    schema: event.schema as D["schema"] & Schema.Top,
    properties: event.schema as D["schema"] & Schema.Top,
  }
}

export * as EventSync from "./event-sync"
