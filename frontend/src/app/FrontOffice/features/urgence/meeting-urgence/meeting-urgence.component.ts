
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt";

@Component({
  selector: 'app-meeting-urgence',
  templateUrl: './meeting-urgence.component.html',
  styleUrls: ['./meeting-urgence.component.css']
})
export class MeetingUrgenceComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {
    // Initialisation ici si nécessaire
  }

  ngAfterViewInit(): void {
    this.initZegoKit();
  }

  initZegoKit(): void {
    const getUrlParams = (url: string): { [key: string]: string } => {
      const params: { [key: string]: string } = {};
      const urlStr = url.split('?')[1];
      if (urlStr) {
        const urlSearchParams = new URLSearchParams(urlStr);
        urlSearchParams.forEach((value, key) => {
          params[key] = value;
        });
      }
      return params;
    };

    const roomID = getUrlParams(window.location.href)['roomID'] || (Math.floor(Math.random() * 10000) + "");
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = "userName" + userID;
    const appID = 1452671263;
    const serverSecret = "48583229452fb527e854f15b8e7998da";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

    const container = document.querySelector("#root") as HTMLElement | null;
    if (!container) {
      console.error("Container #root not found!");
      return;
    }

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: container,
      sharedLinks: [{
        name: 'Personal link',
        url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
      }],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 50,
      layout: "Auto",
      showLayoutButton: true,
    });
  }
}
