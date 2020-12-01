import { Injectable } from '@angular/core';
import { MetaService } from '@ngx-meta/core';

@Injectable({
  providedIn: 'root'
})
export class SpotbieMetaService {

  constructor(private metaService: MetaService) { }

  public setTitle(title: string): void{

    this.metaService.setTitle(title)
    this.metaService.setTag("twitter:title", title)

  }

  public setDescription(description: string): void{

    this.metaService.setTag("description", description)
    this.metaService.setTag("twitter:description", description)

  }

  public setImage(imageUrl: string): void{

    this.metaService.setTag("image", imageUrl)

  }  

}
