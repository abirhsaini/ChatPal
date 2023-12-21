import { Component, Input } from '@angular/core';
import { User } from 'src/app/services/User';
import { CognitoService } from 'src/app/services/cognito.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  constructor(private cognitoService: CognitoService,private cdr: ChangeDetectorRef,) {}
  user:any


  @Input() isConnected: boolean = false;
   members: any[] = [
    { id: 1, username: 'john_doe', email: 'john.doe@example.com', user_name: 'John Doe', user_photoURL: 'https://source.unsplash.com/100x100/?portrait' },
    { id: 2, username: 'jane_smith', email: 'jane.smith@example.com', user_name: 'Jane Smith', user_photoURL: 'https://robohash.org/user1.png' },
    { id: 3, username: 'samuel_jackson', email: 'samuel.jackson@example.com', user_name: 'Samuel Jackson', user_photoURL: 'https://robohash.org/user4.png' },
    { id: 4, username: 'emma_watson', email: 'emma.watson@example.com', user_name: 'Emma Watson', user_photoURL: 'https://source.unsplash.com/100x100/?profile' },
    { id: 5, username: 'michael_jordan', email: 'michael.jordan@example.com', user_name: 'Michael Jordan', user_photoURL: 'https://robohash.org/user5.png' },
    { id: 6, username: 'olivia_smith', email: 'olivia.smith@example.com', user_name: 'Olivia Smith', user_photoURL: 'https://robohash.org/user6.png' },
    { id: 7, username: 'david_jones', email: 'david.jones@example.com', user_name: 'David Jones', user_photoURL: 'https://robohash.org/user7.png' },
    { id: 8, username: 'susan_miller', email: 'susan.miller@example.com', user_name: 'Susan Miller', user_photoURL: 'https://robohash.org/user8.png' },
    { id: 9, username: 'ryan_taylor', email: 'ryan.taylor@example.com', user_name: 'Ryan Taylor', user_photoURL: 'https://robohash.org/user9.png' },
    { id: 10, username: 'lily_james', email: 'lily.james@example.com', user_name: 'Lily James', user_photoURL: 'https://robohash.org/user50.png' },
    // Ajoutez d'autres utilisateurs
  ];
  @Input() chatRows: string[] = [];
  private socket: WebSocket | null = null;

  ngOnDestroy(): void {
    this.disconnect();
  }

  ngOnInit(): void {
    
   
  }

  onSocketOpen() {
    this.isConnected = true;
    const name = prompt('Enter your name');
    this.socket?.send(JSON.stringify({ action: 'setName', name }));
    this.cdr.detectChanges();
  }

  onSocketClose() {
    const userIdToRemove = this.user.id;

  // Find the index of the user in the members array
  const indexToRemove = this.members.findIndex(member => member.id === userIdToRemove);
  console.log(userIdToRemove)
  if (indexToRemove !== -1) {
    // Remove the user from the members array
    this.members.splice(indexToRemove, 1);
  }
  this.cdr.detectChanges();
  
    this.isConnected = false;
    this.chatRows = [];
  }

  onSocketMessage(dataStr: string) {
    this.cdr.detectChanges();
    const data = JSON.parse(dataStr);
 if (data.publicMessage) {
      this.chatRows.push(data.publicMessage);
    } else if (data.privateMessage) {
      alert(data.privateMessage);
    } else if (data.systemMessage) {
      this.chatRows.push(data.systemMessage);
    }
  }
  async onConnect() {
    if (!this.isConnected) {
      try {

        const userAttributes = await this.cognitoService.fetchCurrentUser();
        this.user = {
          id:this.members.length+1,
          username:userAttributes.given_name,
          email:userAttributes.email,
          user_name:userAttributes.given_name
        }

        console.log('User Attributes:', this.user);
        console.log('User:', this.user.user_name);
  
        // Close the existing WebSocket connection
        this.socket?.close();
  
        // Create a new WebSocket connection
        this.socket = new WebSocket('wss://iqeg8hu1ml.execute-api.us-east-1.amazonaws.com/production/');
        this.isConnected = true;
        // Wait for the WebSocket connection to open
        await new Promise<void>((resolve) => {
          this.socket!.addEventListener('open', () => {
            console.log('WebSocket connection opened');
            resolve();
          });
        });
  
        // Send the 'setName' action only when the connection is open
        this.socket?.send(JSON.stringify({ action: 'setName', name: this.user.user_name }));
  
    
        
        // Set up event listeners for other WebSocket events
        this.socket?.addEventListener('close', () => this.onSocketClose());
        this.socket?.addEventListener('message', (event) => this.onSocketMessage(event.data));
  
        this.members.push(this.user);
      } catch (error) {
        console.error('Error fetching current user', error);
      }
    }
  }
  

  onSendPrivateMessage(to: string) {
    const message = prompt('Enter private message for ' + to);
    this.socket?.send(JSON.stringify({
      action: 'sendPrivate',
      message,
      to,
    }));
  }

  onSendPublicMessage() {
    const message = prompt('Enter public message');
    this.socket?.send(JSON.stringify({
      action: 'sendPublic',
      message,
    }));
  }

  onDisconnect() {
    if (this.isConnected) {
      this.disconnect();
    }
  }

  private disconnect() {
    this.socket?.close();
  }


}
