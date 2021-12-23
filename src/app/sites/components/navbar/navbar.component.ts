import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  public link = "";

  constructor(private route: Router) { }

  public linkfun(){
    this.route.navigateByUrl("/"+this.link);
  }

}
