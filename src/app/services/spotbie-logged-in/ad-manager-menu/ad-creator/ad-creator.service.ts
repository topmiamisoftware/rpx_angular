import {Injectable} from '@angular/core';
import * as spotbieGlobals from '../../../../globals';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Ad} from '../../../../models/ad';
import {handleError} from '../../../../helpers/error-helper';

const ADS_API = spotbieGlobals.API + 'in-house';

@Injectable({
  providedIn: 'root',
})
export class AdCreatorService {
  constructor(private http: HttpClient) {}

  saveAd(adObj: Ad): Observable<any> {
    const placeToEatAdApi = `${ADS_API}/create`;

    const adObjToSave = {
      name: adObj.name,
      description: adObj.description,
      type: adObj.type,
      images: adObj.images,
      images_mobile: adObj.images_mobile,
    };

    return this.http
      .post<any>(placeToEatAdApi, adObjToSave)
      .pipe(catchError(handleError('completeReset')));
  }

  activateMembership() {
    const placeToEatAdApi = `${ADS_API}/make-payment`;

    return this.http
      .post<any>(placeToEatAdApi, null)
      .pipe(catchError(handleError('completeReset')));
  }

  updateAd(adObj: Ad): Observable<any> {
    const placeToEatAdApi = `${ADS_API}/update`;

    const adObjToSave = {
      name: adObj.name,
      description: adObj.description,
      type: adObj.type,
      id: adObj.id,
      images: adObj.images,
      images_mobile: adObj.images_mobile,
    };

    return this.http
      .post<any>(placeToEatAdApi, adObjToSave)
      .pipe(catchError(handleError('completeReset')));
  }

  deleteMe(adObj: Ad): Observable<any> {
    const placeToEatAdApi = `${ADS_API}/delete`;

    const adObjToSave = {
      id: adObj.id,
    };

    return this.http
      .post<any>(placeToEatAdApi, adObjToSave)
      .pipe(catchError(handleError('deleteMe')));
  }
}
