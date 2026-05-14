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
