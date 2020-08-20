import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import * as spotbieGlobals from '../../../globals'
export const WS_ENDPOINT = spotbieGlobals.CHAT
  
@Injectable({
  providedIn: 'root'
})
export class DataService {

  public socket

  public closeConnection(){
    this.socket.close()
  }

  public setupSocketConnection() {
    this.socket = io(WS_ENDPOINT)
  }

}
