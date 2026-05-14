import { Bus as ProjectBus } from "@/bus"
import { GlobalBus } from "@/bus/global"
import { SessionEventSync } from "@/session/session-event-sync"
import { SyncEvent } from "@/sync"
import { Event } from "@opencode-ai/core/event"
import "@opencode-ai/core/catalog"
import "@opencode-ai/core/session-event"
import { Effect, Layer, Stream } from "effect"

function emitNormal(event: Event.Payload) {
  GlobalBus.emit("event", {
    directory: event.instance?.directory,
    workspace: event.instance?.workspaceID,
    payload: {
      id: event.id,
      type: event.type,
      properties: event.data,
    },
  })
}

export const layer = Layer.effectDiscard(
  Effect.gen(function* () {
    const events = yield* Event.Service
    const bus = yield* ProjectBus.Service
    const sync = yield* SyncEvent.Service

    yield* events.subscribeAll().pipe(Stream.runForEach(republish(bus, sync)), Effect.forkScoped)
  }),
)

export const defaultLayer: Layer.Layer<never> = layer.pipe(
  Layer.provideMerge(Event.defaultLayer),
  Layer.provideMerge(SyncEvent.defaultLayer),
  Layer.provide(ProjectBus.defaultLayer),
) as unknown as Layer.Layer<never>

const republish = (bus: ProjectBus.Interface, sync: SyncEvent.Interface) => (event: Event.Payload) => {
  const definition = Event.registry.get(event.type)
  if (!definition) return Effect.void

  const publishNormal = bus.publish({ type: definition.type, properties: definition.schema }, event.data, { id: event.id }).pipe(
    Effect.catch(() => Effect.sync(() => emitNormal(event))),
  )
  if (definition.version === undefined) return publishNormal

  return Effect.gen(function* () {
    const syncDefinition = (SessionEventSync.byType as Map<string, SyncEvent.Definition>).get(definition.type)
    if (syncDefinition) return yield* sync.run(syncDefinition as SyncEvent.Definition, event.data as SyncEvent.Event["data"], { publish: true })
    yield* publishNormal
  })
}

export * as EventLegacy from "./event-legacy"
