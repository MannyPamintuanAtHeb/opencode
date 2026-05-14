import { SyncEvent } from "@/sync"
import { Event } from "@opencode-ai/core/event"
import { Schema } from "effect"

const definitions = new WeakMap<Event.Definition, SyncEvent.Definition>()

export function definition<D extends Event.Definition>(event: D): SyncEvent.Definition<D["type"], D["schema"]> {
  const existing = definitions.get(event)
  if (existing) return existing as SyncEvent.Definition<D["type"], D["schema"]>

  const result = SyncEvent.define({
    type: event.type,
    version: event.version ?? 1,
    aggregate: event.aggregate ?? "sessionID",
    schema: event.schema as D["schema"] & Schema.Top,
  })
  definitions.set(event, result)
  return result as SyncEvent.Definition<D["type"], D["schema"]>
}

export * as EventSync from "./event-sync"
