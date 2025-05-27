import { Component } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isConnected: boolean = false;

  constructor(private websocketService: WebsocketService) {
    this.websocketService.getConnectionStatus().subscribe((status: boolean) => {
      this.isConnected = status;
    });
  }
}
