import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraStreamComponent } from './components/camera-stream/camera-stream.component';
import { HeaderComponent } from './components/header/header.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SoundEventsComponent } from './components/sound-events/sound-events.component';

@NgModule({
  declarations: [
    AppComponent,
    CameraStreamComponent,
    HeaderComponent,
    SoundEventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconButton,
    MatIcon,
    MatButton
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
