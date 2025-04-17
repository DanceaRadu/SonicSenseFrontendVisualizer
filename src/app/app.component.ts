import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private socket: WebSocket;
  private peerConnection: RTCPeerConnection | undefined;

  constructor() {
    this.socket = new WebSocket('wss://sonic-sense-signaling.gonemesis.org');  // Signaling server

    this.socket.onopen = () => {
      console.log('Connected to signaling server');
      this.startConnection();
    };

    this.socket.onmessage = (messageEvent) => {
      const message = JSON.parse(messageEvent.data);
      if (message.type === 'offer') {
        this.handleOffer(message);
      } else if (message.type === 'answer') {
        this.handleAnswer(message);
      } else if (message.type === 'candidate') {
        this.handleCandidate(message);
      }
    };
  }

  async startConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
      }
    };

    // Create an SDP offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    // Send the offer to the signaling server
    this.socket.send(JSON.stringify({ type: 'offer', sdp: offer }));
  }

  async handleOffer(message: any) {
    // Handle incoming SDP offer
    await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(message.sdp));

    // Create an SDP answer
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);

    // Send answer back to signaling server
    this.socket.send(JSON.stringify({ type: 'answer', sdp: answer }));
  }

  handleAnswer(message: any) {
    // Handle incoming SDP answer
    this.peerConnection!.setRemoteDescription(new RTCSessionDescription(message.sdp));
  }

  handleCandidate(message: any) {
    // Add ICE candidate to the connection
    if (message.candidate) {
      this.peerConnection!.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
  }
}
