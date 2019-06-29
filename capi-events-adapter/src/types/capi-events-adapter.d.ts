declare namespace CAPIEventsAdapter {
    interface CallbackFn {
        (err?: object, result?: object): void
    }

    interface MessageHandlerFn {
        (redis: any, channel: string, message: any, done: CallbackFn): void
    }

    namespace CAPIEvent {
        namespace V2 {
            type StatusType = 'ACTIVE' | 'INACTIVE' | 'KILLED' | 'DELETED';
        }

        namespace V3 {
            type StatusType = 'active' | 'inactive' | 'killed' | 'deleted' | 'expired';
        }
        
    }

    interface ExternalEvent {
        readonly id: string;
        readonly source: ExternalEvents.Source;
        readonly sourceId: string;
        readonly timeUTC: number;
        readonly kind: ExternalEvents.Kind;
    }
    
    namespace ExternalEvents {
        type Source = 'CAPI';
        type Kind = 'UPDATE' | 'KILL' | 'DELETE';
    }
}