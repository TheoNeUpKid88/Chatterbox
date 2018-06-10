import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  nickname = '';
  e: KeyboardEvent;

  constructor(public navCtrl: NavController, private socket: Socket) { }
 
  joinChat() {
    this.socket.connect();
    this.socket.emit('set-nickname', this.nickname);
    this.navCtrl.push('ChatRoomPage', { nickname: this.nickname });
  }

  keyprss(keyCode){
    if (keyCode == 13) {
      var tb = document.getElementById("usrname");
      eval(tb.nodeValue);
      this.joinChat();
      return false;
    }
  }
}