import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SoundEvent } from '../../../models/sound-event.model';
import { SoundEventsService } from '../../../services/sound-events.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-sound-event',
  standalone: false,
  templateUrl: './sound-event.component.html',
  styleUrl: './sound-event.component.scss'
})
export class SoundEventComponent {
  @Input({ required: true }) soundEvent!: SoundEvent
  @Output() delete = new EventEmitter<string>()
  @Output() playVideo = new EventEmitter<string>()

  isLoading: boolean = false;
  videoUrl: string | null = null;

  constructor(
    private soundEventsService: SoundEventsService,
    private snackBar: SnackBarService
  ) { }

  handlePlayVideo() {
    this.isLoading = true;
    this.soundEventsService.getSoundEventVideo(this.soundEvent.videoId).subscribe({
      next: (video: Blob) => {
        this.videoUrl = URL.createObjectURL(video);
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.showError("Failed to load video");
        this.isLoading = false;
      },
    })
  }

  closeModal(): void {
    this.videoUrl = null;
  }
}
