import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SoundEvent } from '../models/sound-event.model';

@Injectable({
  providedIn: 'root'
})
export class SoundEventsService {

  private readonly apiUrl = `${environment.baseURL}/api/sound-events`;

  constructor(private http: HttpClient) { }

  getAllSoundEvents(): Observable<SoundEvent[]> {
    return this.http.get<SoundEvent[]>(this.apiUrl);
  }

  deleteSoundEventById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
