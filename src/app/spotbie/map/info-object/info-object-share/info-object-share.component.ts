import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ShareService } from '@ngx-share/core';

@Component({
  selector: 'app-info-object-share',
  templateUrl: './info-object-share.component.html',
  styleUrls: ['./info-object-share.component.css']
})
export class InfoObjectShareComponent implements OnInit {

  @Input() infoObject

  @Output() closeWindow = new EventEmitter()

  public infoObjectLink: string
  public infoObjectDescription: string
  
  public bg_color: string

  public successfulUrlCopy: boolean = false
  
  constructor(public share: ShareService) { }

  public closeWindowX(): void{
    this.closeWindow.emit()
  }

  private setItemProperties (){    
    
    this.infoObjectLink = `https://spotbie.com`

  }

  public linkCopy(inputElement) {
    
    inputElement.select()
    
    document.execCommand('copy')

    inputElement.setSelectionRange(0, inputElement.value.length)
    
    this.successfulUrlCopy = true

    setTimeout(function() {
      this.successfulUrlCopy = false
    }.bind(this), 2500)

  }

  ngOnInit(): void {
    console.log("infoObject", this.infoObject)
    this.setItemProperties()
  }

}
