import { AfterViewInit, Component } from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'SonicSenseFrontendVisualizer';

  private player: any;

  ngAfterViewInit(): void {
    this.player = videojs('video', {
      crossOrigin: 'anonymous',
      autoplay: true,
      controls: true,
      sources: [{
        src: '',
        type: 'application/x-mpegURL'
      }]
    });
  }
}
