import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage'
})
export class DefaultImagePipe implements PipeTransform {

  transform(value: string): string {

    let new_url;
    if (value.indexOf('spotbie.com') > -1) {
        new_url = '../../assets/images/user.png';
    } else {
        new_url = value.replace('../../../', '');
        new_url = '/' + new_url;
    }
    // console.log("Default Image pipe : " , new_url);
    return new_url;
  }

}
