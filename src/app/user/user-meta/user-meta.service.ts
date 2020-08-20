import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserMetaService {

  private username : string = '0456fra'

  constructor() { }

  getUserProfileMeta() : any{
    return '';
    return {
      meta: {
        title: this.username + '\'s Profile on SpotBie',
        'twitter:title' : 'Toothpaste',
        override: true,
        description: 'Eating toothpaste is considered to be too healthy!',
        'twitter:description' : 'Eating toothpaste is considered to be too healthy!'
      }
    }    
  }

}
