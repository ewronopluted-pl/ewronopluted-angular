import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesComponent } from './sites.component';
import { RouterModule } from '@angular/router';
import { SitesRouter } from './sites-routing.router';
import { MainComponent } from './components/main/main.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TableModule } from 'primeng/table';
import { DbconnectService } from '../core/service';
import {SliderModule} from 'primeng/slider';
import {ProgressBarModule} from 'primeng/progressbar';
import {ToastModule} from 'primeng/toast';
import { FooterComponent } from './components/footer/footer.component';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SitesComponent,
    MainComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(SitesRouter),
    TableModule,
    SliderModule,
    ProgressBarModule,
    ToastModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    DbconnectService
  ]
})
export class SitesModule { }
