import { Component, OnInit } from '@angular/core'
import { MenuLoggedInComponent } from '../menu-logged-in.component'
import { Subscription } from 'rxjs'
import { ColorsService } from 'src/app/services/background-color/colors.service'

@Component({
  selector: 'app-background-color',
  templateUrl: './background-color.component.html',
  styleUrls: ['./background-color.component.css']
})
export class BackgroundColorComponent implements OnInit {

  public picked_color = ''

  public web_options_subscriber: Subscription

  constructor( private host: MenuLoggedInComponent,
               private web_options_service: ColorsService) { 
  }

  public triggerColorCancel(): void{
    this.closeWindow()
  }

  public confirmColorPick(color: string): void{
    //console.log("trigger color pick")
    this.pickColor(color)
  }

  public pickColor(color: string): void {
    
    this.web_options_service.setBgColor(color).subscribe(
      resp => {
        this.setColor(resp)
      },
      error => {
        console.log("pickColor", error)
      }
    )
    
    this.closeWindow()

  }

  private setColor(web_options_response: any): void{

    if (web_options_response.message == 'success') {

      document.getElementsByTagName('body')[0].style.backgroundColor = this.picked_color

    } else
      console.log('setColor', web_options_response)    

  }

  public closeWindow(): void {
    this.host.closeWindow(this.host.backgroundColorWindow)
  }

  ngOnInit() {
    
    this.picked_color = localStorage.getItem('spotbie_backgroundColor');

    if (this.picked_color == '' 
      || this.picked_color == undefined 
      || this.picked_color == null)
      this.picked_color = 'dimgrey'

    this.web_options_subscriber = this.web_options_service.getWebOptions().subscribe(web_options =>{

      if(web_options.bg_color){
        this.picked_color = web_options.bg_color
      }

    })

  }

}
