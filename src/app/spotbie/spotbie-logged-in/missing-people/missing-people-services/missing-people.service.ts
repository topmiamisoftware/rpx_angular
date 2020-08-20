import { Injectable } from '@angular/core';
import { MissingPerson } from '../missing-person-model/missing-person';

@Injectable({
  providedIn: 'root'
})
export class MissingPeopleService {

  public missing_people : Array<MissingPerson>

  constructor() { }

  public getMissingPeople(){

  }
  
}
