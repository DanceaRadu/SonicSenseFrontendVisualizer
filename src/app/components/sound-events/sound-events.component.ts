import { Component } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-sound-events',
  standalone: false,
  templateUrl: './sound-events.component.html',
  styleUrl: './sound-events.component.scss'
})
export class SoundEventsComponent {
  constructor(private websocketService: WebsocketService) {}
}
