import * as uuid from 'uuid';

const STATUS_MAP = {'ACTIVE': 'UPDATE', 'INACTIVE': 'DELETE', 'KILLED': 'KILL', 'DELETED': 'DELETE'};

function mapStatus(type: CAPIEventsAdapter.CAPIEvent.V2.StatusType): CAPIEventsAdapter.ExternalEvents.Kind {
  return STATUS_MAP[type] as CAPIEventsAdapter.ExternalEvents.Kind;
}

export default function(input: any): CAPIEventsAdapter.ExternalEvent {
    return {
        id: uuid.v4(),
        source: 'CAPI',
        sourceId: input.capiId,
        timeUTC: Date.now(),
        kind: mapStatus(input.status)
      };
}