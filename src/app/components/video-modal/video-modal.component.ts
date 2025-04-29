import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SoundEvent } from '../../models/sound-event.model';

@Component({
  selector: 'app-video-modal',
  standalone: false,
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.scss'
})
export class VideoModalComponent {
  @Input() videoUrl: string | null = null;
  @Input() event: SoundEvent | null = null;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
