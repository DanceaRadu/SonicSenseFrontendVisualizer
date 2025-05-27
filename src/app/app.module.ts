import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraStreamComponent } from './components/camera-stream/camera-stream.component';
import { HeaderComponent } from './components/header/header.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SoundEventsComponent } from './components/sound-events/sound-events.component';
import { provideHttpClient } from '@angular/common/http';
import { SoundEventComponent } from './components/sound-events/sound-event/sound-event.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { VideoModalComponent } from './components/video-modal/video-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from "@angular/forms";
import { MatFormField, MatLabel, MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConnectionStatusComponent } from './components/header/connection-status/connection-status.component';

@NgModule({
  declarations: [
    AppComponent,
    CameraStreamComponent,
    HeaderComponent,
    SoundEventsComponent,
    SoundEventComponent,
    ConfirmationDialogComponent,
    VideoModalComponent,
    FooterComponent,
    ConnectionStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconButton,
    MatIcon,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatProgressSpinner,
    BrowserAnimationsModule,
    FormsModule,
    MatSelect,
    MatOption,
    MatLabel,
    MatFormField,
    MatDatepickerInput,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
