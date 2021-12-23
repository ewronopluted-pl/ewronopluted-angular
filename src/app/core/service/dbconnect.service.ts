import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbconnectService{
  constructor(private http: HttpClient) {}

  public adress = "https://api.ewronopluted.pl/";
  //public adress = "http://localhost:8080/";

  public async getStreamer(username: string){
    let data = await this.http.get(this.adress+"user", {params: {"username": username}}).toPromise();
    return data;
  }

  public async incrementModerator(id){
    let data = await this.http.get(this.adress+"incrementModerator", {params: {"id": id}}).toPromise();
    return data;
  }

  public async incrementUser(id){
    let data = await this.http.get(this.adress+"incrementUser", {params: {"id": id}}).toPromise();
    return data;
  }
}
