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
  filteredSoundEvents: SoundEvent[] = [];

  isLoading: boolean = true;

  selectedSoundType: string = 'All';
  startDate: Date | null = null;
  endDate: Date | null = null;
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private websocketService: WebsocketService,
    private soundEventsService: SoundEventsService,
    private snackBar: SnackBarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.soundEventsService.getAllSoundEvents().subscribe({
      next: (events: SoundEvent[]) => {
        this.soundEvents = events;
        this.filteredSoundEvents = this.filterAndSortEvents(events);
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

  private filterAndSortEvents(soundEvents: SoundEvent[]) {
    return soundEvents
      .filter(event => {
        return this.selectedSoundType == 'All' || event.soundType == this.selectedSoundType;
      })
      .filter(event => {
        const date = new Date(event.time);
        return (!this.startDate || date >= new Date(this.startDate)) &&
        (!this.endDate || date <= new Date(this.endDate));
      })
      .sort((a, b) => {
        const d1 = new Date(a.time).getTime();
        const d2 = new Date(b.time).getTime();
        return this.sortDirection === 'asc' ? d1 - d2 : d2 - d1;
      });
  }

  private handleWebsocketMessage(message: WebsocketEvent) {
    if (message.action === 'created') {
      this.soundEvents.unshift(message.event!);
      this.filteredSoundEvents = this.filterAndSortEvents(this.soundEvents);
    } else if (message.action === 'deleted') {
      this.soundEvents = this.soundEvents.filter(event => event.id !== message.id);
      this.filteredSoundEvents = this.filteredSoundEvents.filter(event => event.id !== message.id);
    }
  }

  getUniqueSoundTypes(): string[] {
    return Array.from(new Set(this.soundEvents.map(event => event.soundType)));
  }

  onFilterChange(): void {
    this.filteredSoundEvents = this.filterAndSortEvents(this.soundEvents);
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
}
