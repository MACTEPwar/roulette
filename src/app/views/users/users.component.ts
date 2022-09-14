import { Subscription } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { EmptyObject } from 'apollo-angular/types';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Observable<Array<User>>;
  visibleModalForAddesUser = false;

  profileForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    nicname: new FormControl('', Validators.required),
    gameId: new FormControl('', Validators.required),
  });

  subscription: any;

  constructor(private userService: UserService) {
    this.users$ = userService.users$;
    this.subscription = this.userService.subscribeToUsers$().subscribe();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openModalForAddesUser(): void {
    this.visibleModalForAddesUser = true;
  }

  addUser(): void {
    this.userService.addUser(this.profileForm.getRawValue());
    this.visibleModalForAddesUser = false;
  }

  deleteUser(user: User): void {
    const pass = prompt('Введiть пароль');
    if (pass === '123qweASD!@#') {
      this.userService.deleteUser(user.id);
    } else {
      alert('Пароль не вiрний');
    }
  }

  showModalForAddTeam(): void {
    
  }
}
