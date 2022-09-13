import { UserService } from './service/user.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserService],
})
export class AppComponent {
  title = 'roulette';
  users$: Observable<Array<User>>;
  visibleModalForAddesUser = false;

  profileForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    nicname: new FormControl('', Validators.required),
    gameId: new FormControl('', Validators.required),
  });

  constructor(private userService: UserService) {
    this.users$ = userService.users$;
    this.userService.getAllUsers();

    this.userService.subscribeToUsers$().subscribe((res) => console.log(res));
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
}
