import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { SoundEventsService } from '../../services/sound-events.service';
import { SoundEvent } from '../../models/sound-event.model';
import { SnackBarService } from '../../services/snack-bar.service';
import { WebsocketEvent } from '../../models/websocket-event.model';

@Component({
  selector: 'app-sound-events',
  standalone: false,
  templateUrl: './sound-events.component.html',
  styleUrl: './sound-events.component.scss'
})
export class SoundEventsComponent implements OnInit {

  soundEvents: SoundEvent[] = []

  constructor(
    private websocketService: WebsocketService,
    private soundEventsService: SoundEventsService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.soundEventsService.getAllSoundEvents().subscribe({
      next: (events: SoundEvent[]) => {
        this.soundEvents = events.sort((a, b) => {
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        });
      },
      error: () => {
        this.snackBar.showError("Failed to load sound events");
      }
    });

    this.websocketService.getMessages().subscribe((message: WebsocketEvent) => {
      this.handleWebsocketMessage(message);
    })
  }

  private handleWebsocketMessage(message: WebsocketEvent) {
    if (message.action === 'created') {
      this.soundEvents.unshift(message.event!);
    } else if (message.action === 'deleted') {
      this.soundEvents = this.soundEvents.filter(event => event.id !== message.id);
    }
  }

  handleEventDelete(id: string) {
    this.soundEventsService.deleteSoundEventById(id).subscribe({
      next: () => {
        this.snackBar.showSuccess("Event deleted successfully");
      },
      error: () => {
        this.snackBar.showError("Failed to delete event");
      }
    });
    this.soundEvents = this.soundEvents.filter(event => event.id !== id);
  }
}
