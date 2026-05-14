import { SyncEvent } from "@/sync"
import { EventSync } from "@/event-sync"
import { EventSequenceTable } from "@/sync/event.sql"
import { Database, eq } from "@/storage/db"
import { Event } from "@opencode-ai/core/event"
import { Effect } from "effect"

export function publish<D extends Event.Definition>(
  events: Event.Interface,
  sync: SyncEvent.Interface,
  definition: D,
  data: Event.Data<D>,
) {
  return Effect.gen(function* () {
    const syncDefinition = EventSync.definition(definition)
    yield* sync.run(syncDefinition, data as SyncEvent.Event<typeof syncDefinition>["data"], { publish: false })
    const aggregateID = (data as Record<string, string>)[syncDefinition.aggregate]
    const row = aggregateID
      ? Database.use((db) =>
          db.select({ seq: EventSequenceTable.seq }).from(EventSequenceTable).where(eq(EventSequenceTable.aggregate_id, aggregateID)).get(),
        )
      : undefined
    return yield* events.publish(definition, data, {
      id: Event.ID.create(),
      metadata: {
        sync: {
          seq: row?.seq ?? 0,
          aggregateID: aggregateID ?? Event.ID.create(),
        },
      },
    })
  })
}

export * as EventPublish from "./event-publish"
