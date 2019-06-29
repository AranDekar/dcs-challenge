import { invalidateCapi } from '../../../../cache/strategies/capi/v2/invalidate';

const handler = (event: Tabula.ExternalEvent, cb: Tabula.Callback): void => {
    const kind = event.kind;
    switch (kind) {
        case 'UPDATE':
        case 'KILL':
        case 'DELETE':
        invalidateCapi(event.sourceId, cb);
    }
};

export { handler };
