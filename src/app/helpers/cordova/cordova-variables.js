export const isCordova = function (){
    
    let isCordova = localStorage.getItem('isCordova')

    if(isCordova === '1') return true; else return false;

}