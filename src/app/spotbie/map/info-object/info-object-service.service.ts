import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { displayError } from 'src/app/helpers/error-helper'
import { HttpResponse } from 'src/app/models/http-reponse'

const YELP_API = 'https://www.spotbie.com/api/yelp.php'

const HTTP_OPTIONS_2 = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class InfoObjectServiceService {

  constructor(private http : HttpClient) { }

  public pullInfoObject(yelp_obj, callback) {

    const yelp_obj2 = JSON.stringify(yelp_obj)

    //console.log("Yelp 2 Object ", yelp_obj2)

    this.http.post<HttpResponse>(YELP_API, yelp_obj2, HTTP_OPTIONS_2)
              .subscribe( resp => {
                //console.log('The Yelp Response : ', resp)
                const httpResponse = new HttpResponse ({
                  status : resp.status,
                  message : resp.message,
                  full_message : resp.full_message,
                  responseObject : resp.responseObject
                })
                callback(httpResponse)
              },
                error => {
                  displayError(error)
    })

  }

}
