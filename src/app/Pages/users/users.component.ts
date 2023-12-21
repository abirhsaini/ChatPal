import { Component } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent {
  users: any[] = []; 
  constructor(private cognitoService: CognitoService) {}
  
  ngOnInit(): void {
    // Initialisez votre liste d'utilisateurs ici (par exemple, depuis une API ou un service)
    this.users = [
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
  }
  
  // async fetchUsers() {
  //   try {
  //     this.users = await this.cognitoService.fetchUsers();
  //     console.log(this.users);
  //   } catch (error) {
  //     console.error('Error fetching users', error);
  //   }
  // }
}
