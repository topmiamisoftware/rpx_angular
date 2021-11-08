import { Component, OnInit } from '@angular/core';

import * as calendly from '../../helpers/calendly/calendlyHelper'

@Component({
  selector: 'app-schedule-business-demo',
  templateUrl: './schedule-business-demo.component.html',
  styleUrls: ['./schedule-business-demo.component.css']
})
export class ScheduleBusinessDemoComponent implements OnInit {

  public calendlyUp: boolean = false
  public loading = false

  constructor() { }

  public calendly(){
        
    this.loading = true
    this.calendlyUp = !this.calendlyUp

    if(this.calendlyUp) 
        calendly.spawnCalendlyNormal(() => { this.loading = false } )
    else
        this.loading = false

  }

  ngOnInit(): void {
    this.calendly()
  }

}
