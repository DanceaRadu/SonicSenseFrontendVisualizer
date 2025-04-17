import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-camera-stream',
  standalone: false,
  templateUrl: './camera-stream.component.html',
  styleUrl: './camera-stream.component.scss'
})
export class CameraStreamComponent implements AfterViewInit {

  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef<HTMLVideoElement>;
  peerConnection!: RTCPeerConnection;
  signalingSocket!: WebSocket;

  readonly SIGNALING_SERVER_URL = 'wss://sonic-sense-signaling.gonemesis.org';
  readonly STUN_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ];

  ngAfterViewInit() {
    this.initWebRTC();
  }

  initWebRTC() {
    this.peerConnection = new RTCPeerConnection({ iceServers: this.STUN_SERVERS });

    this.peerConnection.ontrack = (event) => {
      console.log('Received remote track:', event);
      const [stream] = event.streams;
      this.remoteVideoRef.nativeElement.srcObject = stream;
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE Connection State Changed:", this.peerConnection.iceConnectionState);
      console.log(this.peerConnection)
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate event:', event);
        this.signalingSocket.send(JSON.stringify({
          type: 'candidate',
          candidate: {
            "component" : event.candidate.component,
            "foundation": event.candidate.foundation,
            "ip": event.candidate.address,
            "port": event.candidate.port,
            "priority": event.candidate.priority,
            "protocol": event.candidate.protocol,
            "type": event.candidate.type,
            "relatedAddress": event.candidate.relatedAddress,
            "relatedPort": event.candidate.relatedPort,
            "sdpMid": event.candidate.sdpMid,
            "sdpMLineIndex": event.candidate.sdpMLineIndex,
            "tcpType": event.candidate.tcpType,
          }
        }))
      }
    };

    this.signalingSocket = new WebSocket(this.SIGNALING_SERVER_URL);

    this.signalingSocket.onmessage = async (messageEvent) => {
      const data = JSON.parse(messageEvent.data);

      if (data.type === 'offer') {
        console.log('Received offer:', data);
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data));

        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);

        this.signalingSocket.send(JSON.stringify({
          type: 'answer',
          sdp: answer.sdp,
          sdpType: answer.type
        }));
      } else if (data.type === 'candidate') {
        try {
          console.log('Received ICE candidate:', data);
          await this.peerConnection.addIceCandidate(data.candidate);
        } catch (err) {
          console.error('Error adding received ice candidate', err);
        }
      }
    };

    this.signalingSocket.onopen = () => {
      console.log('✅ Connected to signaling server');
    };

    this.signalingSocket.onerror = (err) => {
      console.error('❌ Signaling WebSocket error:', err);
    };
  }
}
