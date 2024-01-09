import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as spotbieGlobals from '../globals';
import {handleError} from '../helpers/error-helper';

const BUGS_API = `${spotbieGlobals.API}bugs`;

@Injectable({
  providedIn: 'root',
})
export class BugsService {
  constructor(private http: HttpClient) {}

  public insertBug(bugObjRequest: any): Observable<any> {
    const bugsApi = `${BUGS_API}/insert`;

    return this.http
      .post<any>(bugsApi, bugObjRequest)
      .pipe(catchError(handleError('pullInfoObject')));
  }
}
