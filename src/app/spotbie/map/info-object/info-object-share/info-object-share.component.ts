import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  public successful_url_copy: boolean = false
  
  constructor(public share: ShareService) { }

  public closeWindowX(): void{
    this.closeWindow.emit()
  }

  private setItemProperties (){    
    
    this.infoObjectLink = `https://spotbie.com`

  }

  public linkCopy(input_element) {
    
    input_element.select();
    document.execCommand('copy');
    input_element.setSelectionRange(0, input_element.value.length);
    this.successful_url_copy = true;

    setTimeout(function() {
      this.successful_url_copy = false;
    }.bind(this), 2500);

  }

  ngOnInit(): void {
    console.log("infoObject", this.infoObject)
    this.setItemProperties()
  }

}
