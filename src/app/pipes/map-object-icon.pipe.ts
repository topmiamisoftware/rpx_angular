import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'mapObjectIcon'})
export class MapObjectIconPipe implements PipeTransform {
  transform(value : string) : string {

    let new_url

    if (value.indexOf('user.png') > -1) {
        new_url = '/defaults/user.png'
    } else {
        new_url = value.replace('../../../', '')
        new_url = new_url.replace('defaults', 'defaults_c')
        new_url = '/' + new_url
    }
    //console.log("mapObjectIcon pipe : " , new_url)
    return new_url
  }
}
