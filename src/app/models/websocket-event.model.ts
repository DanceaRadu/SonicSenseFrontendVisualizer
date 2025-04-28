import { SoundEvent } from './sound-event.model';

export interface WebsocketEvent {
  action: string;
  event: SoundEvent | undefined;
  id: string | undefined
}
