import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { DbconnectService } from 'src/app/core/service';
import { InfoModel } from 'src/app/core/model/info.model';
import { MessageService, FilterService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import * as twitchEmotes from "twitch-emoji";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MessageService]
})
export class MainComponent implements OnInit {
  public channel: string = "ewroon";
  public data: InfoModel[] = [];
  public display: boolean = false;
  public nowEdit: number = 0;
  public token: string = "0";
  public isAdmin: boolean = false;
  public nextLoading = 180;
  public dataInFiltr = null;

  constructor(private filterService: FilterService,public routing: ActivatedRoute,private route: Router, private dbConn: DbconnectService, private messageService: MessageService) { }

  async ngOnInit(): Promise<void> {
    this.checkCookie(2);
    this.channel = this.route.url.substring(1);
    this.channel == "" ? this.channel = "ewroon": "";
    await this.loadData()

    this.route.events.subscribe(async (val: any)=>{
      if(val instanceof NavigationEnd){
        this.channel = this.route.url.substring(1);
        this.channel == "" ? this.channel = "ewroon": "";
        if(this.route.url == "/awaterek" || this.route.url == "/Niedsam#6636"){
          this.isAdmin = true;
          this.messageService.add({severity:'success', summary:'admin', detail:'admin!'})
        }
  
        await this.loadData();
      }
    })

    if(this.route.url == "/awaterek" || this.route.url == "/Niedsam#6636"){
      this.isAdmin = true;
      this.messageService.add({severity:'success', summary:'admin', detail:'admin!'})
    }

    setInterval(()=>{this.nextLoading--;}, 1000);
    setInterval(()=>{this.nextLoading = 180; this.loadData()}, 180000);

  }
  

  public async loadData(){
    let localData = await this.dbConn.getStreamer(this.channel);
    let items: InfoModel[] = [];
    for(const [key, value] of Object.entries(localData)){
      let item: InfoModel = {
        id: value.id,
        date: new Date(value.date),
        user: value.user,
        month: value.month,
        message: value.message,
        amount: value.amount,
        type: value.type,
        channel: value.channel,
        userAccepted: value.userAccepted,
        moderatorAccepted: value.moderatorAccepted,
        uptime: value.uptime,
        video: value.video
      }
      items.push(item);
      console.log(twitchEmotes.parse(value.message));
    }

    this.data = items;
  }


  public stats(number: number): number{
    return (number * 5);
  }

  public stats2(number: number): number{
    return (number * 100);
  }

  public uptimeCalc(number){
    let hours = Math.floor(number/1000/60/60);
    number -= hours*60*60*1000;
    let minuts = Math.floor(number/60/1000);
    number -= minuts*60*1000;
    let seconds = Math.floor(number/1000);
    number -= seconds*1000;
    let hoursString: string ="";
    let minutString: string ="";
    let secondsString: string ="";
    hours < 10 ? hoursString = "0"+hours : hoursString = ""+hours;
    minuts < 10 ? minutString = "0"+minuts : minutString = ""+minuts;
    seconds < 10 ? secondsString = "0"+seconds : secondsString = ""+seconds;
    return hoursString+":"+minutString+":"+secondsString;
  }

  public returnInfo(info: InfoModel){
    if(info.type=="resub" || info.type=="sub"){
      return "Month "+info.month;
    } else if (info.type == "cheer"){
      return "Cheer "+info.amount;
    } else if(info.type == "subgift"){
      return "gift "+info.month;
    } else {
      return "";
    }
  }

  public openDialog(id: number){
    this.display = true;
    this.nowEdit = id;
  }

  public isTrue(info: InfoModel){
    let isTrue = info.moderatorAccepted > 0 || info.userAccepted > 2;
    if(info.type == "cheer" && info.amount < 50){
      return "przed";
    }else if(isTrue){
      return "nieoplute" 
    } else {
      if(info.uptime == 0){
        return "przed"
      } else {
        return "oplute"
      }
    }
  }

  public isCheer(info: InfoModel){
    let data = false;
    if(info.type == "cheer"){
      if(info.amount > 49){
        return true
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  public incrementUser(id){
    if(this.isAdmin){
      this.incrementModerator(id);
    } else {
      if(this.checkCookie(id)){
        this.messageService.add({severity:'error', summary:'Błąd', detail:'Już potwierdziłeś ten wpis!'})
      } else {
        this.dbConn.incrementUser(id);
        this.data.forEach(val => {
          if(val.id == id){
            val.moderatorAccepted++;
          }
        })
        this.addCookie(id);
      }
    }
  }

  public incrementModerator(id){
    this.dbConn.incrementModerator(id);
      this.display = false;
      this.data.forEach(val => {
        if(val.id == id){
          val.moderatorAccepted++;
        }
      })
      this.messageService.add({severity:'info', summary:'Sukces', detail:'Poprawnie potwierdzono!'});
  }

  public checkCookie(id: number){
    let cookies = this.getCookie();
    if(cookies){
      let cookiesArray: number[] = JSON.parse(cookies);
      for(let cookie of cookiesArray){
        if(cookie == id){
          return true;
        }
      }
    }
    return false;
  }

  public addCookie(id: number){
    let array = JSON.parse(this.getCookie());
    array.push(id);
    document.cookie = "ids = "+JSON.stringify(array);
  }

  public getCookie() {
    let name = "ids" + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  public getPrecent(){
    let procent = 0;
    let all = 0;
    this.data.forEach(val =>{
      (val.moderatorAccepted != 0 && val.uptime !=0) ? procent++ : "";
      (val.uptime != 0) ? all++ : "";
    })

    return procent+"/"+all+" ("+(Math.floor((procent/all)*10000)/100)+"%)";
  }

  public archive(info: InfoModel){
    let date = new Date();
    if((date.getTime() - info.date.getTime()) > 1000*60*60*30){
      return true;
    } else {
      return false;
    }
  }

  public videoTime(info: InfoModel){
    let number = info.uptime;
    let hours = Math.floor(number/1000/60/60);
    number -= hours*60*60*1000;
    let minuts = Math.floor(number/60/1000);
    number -= minuts*60*1000;
    let seconds = Math.floor(number/1000);
    number -= seconds*1000;
    let hoursString: string ="";
    let minutString: string ="";
    let secondsString: string ="";
    hours < 10 ? hoursString = "0"+hours : hoursString = ""+hours;
    minuts < 10 ? minutString = "0"+minuts : minutString = ""+minuts;
    seconds < 10 ? secondsString = "0"+seconds : secondsString = ""+seconds;


    return info.video+"?t="+hoursString+"h"+minutString+"m"+secondsString+"s";
  }
  
  public choosenDate(){
    let procent = 0;
    let all = 0;
    
    this.data.forEach(val =>{
      let year = val.date.getFullYear();
      let month = val.date.getMonth() + 1;
      let day = val.date.getDate();
      let yearNow = (new Date(this.dataInFiltr)).getFullYear();
      let monthnow = (new Date(this.dataInFiltr)).getMonth()+1;
      let daynow = (new Date(this.dataInFiltr)).getDate();
      let theDay = (year == yearNow && month == monthnow && day == daynow-1);
      (val.moderatorAccepted != 0 && val.uptime !=0 && theDay) ? procent++ : "";
      (val.uptime != 0 && theDay) ? all++ : "";
    })

    if(!this.dataInFiltr) return "nie wybrano daty";
    return procent+"/"+all+" ("+(Math.floor((procent/all)*10000)/100)+"%)";
  }

  public onFilter($event){
    this.dataInFiltr = $event.filters.date[0].value;
    console.log(this.dataInFiltr);
  }

}
