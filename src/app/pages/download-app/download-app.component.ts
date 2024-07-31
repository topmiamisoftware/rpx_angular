import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as spotbieGlobals from '../../globals';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {User} from "../../models/user";

const UPDATE_API = spotbieGlobals.API + 'business-app';

@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.css'],
})
export class DownloadAppComponent implements OnInit {
  _progress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  canDownload$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
  ) {
    const token = localStorage.getItem('spotbiecom_session');
    console.log('User', token);
    if (token) {
      this.canDownload$.next(true);
    }
  }

  ngOnInit(): void {}

  private updateProgress(progress: number): void {
    this._progress$.next(progress);
  }

  downloadApp(): void {
    const updateApi = `${UPDATE_API}/download`;
    this.http
      .get(updateApi, {
        responseType: 'blob',
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        tap(event => {
          if (event.type === HttpEventType.DownloadProgress) {
            console.log('the upload progress', event);
            this.updateProgress(Math.round((100 * event.loaded) / 151176512));
          } else if (event.type === HttpEventType.Response) {
            this.eventTypeResponse(event);
          } else {
            console.warn('Upload error', event);
          }
        })
      )
      .subscribe();
  }

  private async eventTypeResponse(r) {
    console.log('eventTypeResponse', r);
    // Desktop Behavior
    const blob = r.body as Blob;
    const url = window.URL.createObjectURL(blob);
    window.open(url);

    this._progress$.next(100);
  }
}
