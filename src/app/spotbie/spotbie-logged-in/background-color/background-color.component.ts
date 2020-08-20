import { Component, OnInit } from '@angular/core'
import { COLOR_LIST } from '../../../lists/color.list'
import { HttpResponse } from '../../../models/http-reponse'
import { MenuLoggedInComponent } from '../menu-logged-in.component'
import { Subscription } from 'rxjs'
import { ColorsService } from 'src/app/services/background-color/colors.service'

@Component({
  selector: 'app-background-color',
  templateUrl: './background-color.component.html',
  styleUrls: ['./background-color.component.css']
})
export class BackgroundColorComponent implements OnInit {

  color_list = COLOR_LIST

  public picked_color = ''

  public web_options_subscriber : Subscription

  constructor( private host : MenuLoggedInComponent,
               private web_options_service : ColorsService) { 

    this.web_options_subscriber = this.web_options_service.getWebOptions().subscribe(web_options =>{

      console.log("web options", web_options)

      if(web_options){
        this.picked_color = web_options.bg_color
      }

    })

  }

  public triggerColorCancel() : void{
    this.closeWindow()
  }

  public confirmColorPick(color : string) : void{
    //console.log("trigger color pick")
    this.pickColor(color)
  }

  public pickColor(color) : void {

    const exe_api_key = localStorage.getItem('spotbie_userApiKey')
    
    const exe_color_object = { exe_api_key, exe_colors_action : 'setBgColor', exe_color_picked : color}

    this.web_options_service.callWebOptionsApi()
    
    this.closeWindow()

  }

  private setColor(web_options_response : HttpResponse) : void{
    if (web_options_response.status == '200') {

      document.getElementsByTagName('body')[0].style.backgroundColor =  this.picked_color

    } else
      console.log('Color Error: ', web_options_response)    
  }

  public closeWindow() : void {
    this.host.closeWindow(this.host.backgroundColorWindow)
  }

  ngOnInit() {
    
    //console.log("Background pick")
    
    const picked_color = localStorage.getItem('spotbie_backgroundColor')
    
    if (picked_color != '') {
      this.picked_color = picked_color
    } else
      this.picked_color = 'dimgrey'

  }

}
