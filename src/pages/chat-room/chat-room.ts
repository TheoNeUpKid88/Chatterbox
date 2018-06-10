import { Socket } from 'ng-socket-io';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavParams, ToastController } from 'ionic-angular';
 
@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})

export class ChatRoomPage {
  private _HOST : string = "http://localhost:3000";
  messages = [];
  nickname = '';
  message = '';
  
  constructor(private socket : Socket,
              private _HTTP  : HttpClient,
              private navParams: NavParams,
              private toastCtrl: ToastController) {
  

    this.nickname = this.navParams.get('nickname');
 
    this.getMessages().subscribe(message => {
      this.messages.push(message);
    });
    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
  }
 
  sendMessage() {
    this.socket.emit('add-message', { text: this.message });
    this.db_messages();
    this.message = '';
  }
 
  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
 
  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  db_messages(){
    let headers : any = new HttpHeaders({ 'Content-Type': 'application/json' }),
    options 		: any 		 = { text : this.message, from: this.nickname},
    url       	: any      = this._HOST + "/api/a/AddMessages";
    this._HTTP
    .post(url, options, headers)
    .subscribe((data: any) =>{
      this.showToast(this.nickname + " was successfully stored in DB");
    },
    (error : any) =>{
        console.dir(error);
    });
  }

  keyprss(keyCode){
    if (keyCode == 13) {
      var tb = document.getElementById("message");
      eval(tb.nodeValue);
      this.sendMessage();
      return false;
    }
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}