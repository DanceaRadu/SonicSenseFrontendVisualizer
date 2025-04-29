import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SoundEvent } from '../../../models/sound-event.model';

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
}
