import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactmeComponent } from './contactme.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [ContactmeComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,    
  ],
  exports : [ContactmeComponent]
})
export class ContactmeModule { }
