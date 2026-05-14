import { EventSync } from "@/event-sync"
import { SessionEvent } from "@opencode-ai/core/session-event"

export const AgentSwitched = EventSync.definition(SessionEvent.AgentSwitched)
export const ModelSwitched = EventSync.definition(SessionEvent.ModelSwitched)
export const Prompted = EventSync.definition(SessionEvent.Prompted)
export const Synthetic = EventSync.definition(SessionEvent.Synthetic)

export const Shell = {
  Started: EventSync.definition(SessionEvent.Shell.Started),
  Ended: EventSync.definition(SessionEvent.Shell.Ended),
}

export const Step = {
  Started: EventSync.definition(SessionEvent.Step.Started),
  Ended: EventSync.definition(SessionEvent.Step.Ended),
  Failed: EventSync.definition(SessionEvent.Step.Failed),
}

export const Text = {
  Started: EventSync.definition(SessionEvent.Text.Started),
  Delta: EventSync.definition(SessionEvent.Text.Delta),
  Ended: EventSync.definition(SessionEvent.Text.Ended),
}

export const Reasoning = {
  Started: EventSync.definition(SessionEvent.Reasoning.Started),
  Delta: EventSync.definition(SessionEvent.Reasoning.Delta),
  Ended: EventSync.definition(SessionEvent.Reasoning.Ended),
}

export const Tool = {
  Input: {
    Started: EventSync.definition(SessionEvent.Tool.Input.Started),
    Delta: EventSync.definition(SessionEvent.Tool.Input.Delta),
    Ended: EventSync.definition(SessionEvent.Tool.Input.Ended),
  },
  Called: EventSync.definition(SessionEvent.Tool.Called),
  Progress: EventSync.definition(SessionEvent.Tool.Progress),
  Success: EventSync.definition(SessionEvent.Tool.Success),
  Failed: EventSync.definition(SessionEvent.Tool.Failed),
}

export const Retried = EventSync.definition(SessionEvent.Retried)

export const Compaction = {
  Started: EventSync.definition(SessionEvent.Compaction.Started),
  Delta: EventSync.definition(SessionEvent.Compaction.Delta),
  Ended: EventSync.definition(SessionEvent.Compaction.Ended),
}

export * as SessionEventSync from "./session-event-sync"
