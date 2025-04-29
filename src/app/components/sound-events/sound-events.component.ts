import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { SoundEventsService } from '../../services/sound-events.service';
import { SoundEvent } from '../../models/sound-event.model';
import { SnackBarService } from '../../services/snack-bar.service';
import { WebsocketEvent } from '../../models/websocket-event.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-sound-events',
  standalone: false,
  templateUrl: './sound-events.component.html',
  styleUrl: './sound-events.component.scss'
})
export class SoundEventsComponent implements OnInit {

  soundEvents: SoundEvent[] = []
  isLoading: boolean = true;

  videoUrl: string | null = null;
  selectedEvent: SoundEvent | null = null;
  isLoadingVideo: boolean = false;

  constructor(
    private websocketService: WebsocketService,
    private soundEventsService: SoundEventsService,
    private snackBar: SnackBarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.soundEventsService.getAllSoundEvents().subscribe({
      next: (events: SoundEvent[]) => {
        this.soundEvents = events.sort((a, b) => {
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        });
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.showError("Failed to load sound events");
        this.isLoading = false;
      },
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

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this event?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
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
    });
  }

  handlePlayVideo(videoId: string) {
    this.isLoadingVideo = true;
    this.soundEventsService.getSoundEventVideo(videoId).subscribe( {
      next: (video: Blob) => {
        this.selectedEvent = this.soundEvents.find(event => event.videoId === videoId) || null;
        this.videoUrl = URL.createObjectURL(video);
        this.isLoadingVideo = false;
      },
      error: () => {
        this.snackBar.showError("Failed to load video");
        this.isLoadingVideo = false;
      },
    })
  }

  closeModal(): void {
    this.videoUrl = null;
    this.selectedEvent = null;
  }
}
