import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root'
})
export class SpotbieMetaService {

  constructor(private titleService: Title, private metaService: Meta) { }

  public setTitle(title: string): void{

    this.titleService.setTitle(title)

    this.metaService.addTags([
      {name: 'twitter:title', content: title },
      {name: 'og:title', content: title }
    ])

  }

  public setDescription(description: string): void{

    this.metaService.addTags([
      //{name: 'keywords', content: description },
      {name: 'description', content: description },
      {name: 'og:description', content: description },
      {name: 'twitter:description', content: description },
      {name: 'robots', content: 'index, follow'}
    ])  

  }

  public setImage(imageUrl: string): void{

    this.metaService.addTags([
      {name: 'image', content: imageUrl},
      {name: 'og:image', content: imageUrl},
      {name: 'twitter:image', content: imageUrl}
    ]);    

  }  

}
