import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, OnInit , ViewChild } from '@angular/core';
import { SoundEvent } from '../../models/sound-event.model';

@Component({
  selector: 'app-video-modal',
  standalone: false,
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.scss'
})
export class VideoModalComponent implements OnInit, OnDestroy {
  @Input() videoUrl: string | null = null;
  @Input() event: SoundEvent | null = null;
  @Output() close = new EventEmitter<void>();

  @ViewChild('modalContainer') modalContainerRef!: ElementRef;

  private onClickOutside = (event: MouseEvent) => {
    if (
      this.modalContainerRef &&
      !this.modalContainerRef.nativeElement.contains(event.target)
    ) {
      this.closeModal();
    }
  };

  ngOnInit() {
    document.addEventListener('click', this.onClickOutside, true);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onClickOutside, true);
  }

  closeModal() {
    this.close.emit();
  }
}
