import { Observable, of } from 'rxjs';

export function displayError(error) {
    console.log('SpotBie Error : ', error);
}

export function displayToast(toast_message : string) : void{

    const new_div = document.getElementById('spotbieToastErrorMsg');
    new_div.innerHTML = toast_message;
    document.getElementById('spotbieToastErrorOverlay').style.display = 'block';

    setTimeout(function(){ 
        dismissToast()
    }, 2000)
}

export function dismissToast() : void{   
    document.getElementById('spotbieToastErrorOverlay').style.display = 'none';
}

export function handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);

    };
  }
