import { Injectable } from '@angular/core';
import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt";

@Injectable({
  providedIn: 'root'
})
export class ZegoCloudService {

  constructor() { }
  generateZegoLink(): Promise<string> {
    return new Promise((resolve, reject) => {
      const roomID = Math.floor(Math.random() * 10000) + "";
      const userID = Math.floor(Math.random() * 10000) + "";
      const userName = "userName" + userID;
      const appID = 1452671263; // Remplacez par votre appID réel
      const serverSecret = "#################"; // Remplacez par votre serverSecret réel
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

      const personalLink = window.location.protocol + '//' + window.location.host + '/meetingUrgence?roomID=' + roomID;

      resolve(personalLink);
    });
  }
}
