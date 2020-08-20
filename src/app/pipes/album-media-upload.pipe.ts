import { Pipe, PipeTransform } from '@angular/core';
import * as spotbieGlobals from '../globals';

const SPOTBIE_TOP_DOMAIN = spotbieGlobals.RESOURCES;

@Pipe({
  name: 'albumMediaPath'
})
export class AlbumMediaUploadPipe implements PipeTransform {

  transform(extra_media_path: string): string {
    if(!extra_media_path) return;
    //console.log("Extra Media Path from pipe : ", extra_media_path);
    let new_path = extra_media_path.split("../");
    extra_media_path = SPOTBIE_TOP_DOMAIN + new_path[1];
    //console.log("the Extra Media Path : ", extra_media_path);
    return extra_media_path;
  }

}
