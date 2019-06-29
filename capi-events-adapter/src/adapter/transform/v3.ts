import * as uuid from 'uuid';

const STATUS_MAP = {'active': 'UPDATE', 'inactive': 'DELETE', 'killed': 'KILL', 'deleted': 'DELETE', 'expired': 'DELETE'};

function mapStatus(type: CAPIEventsAdapter.CAPIEvent.V3.StatusType): CAPIEventsAdapter.ExternalEvents.Kind {
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