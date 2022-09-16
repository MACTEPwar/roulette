import { TeamService } from 'src/app/service/team.service';
import { Subscription } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { EmptyObject } from 'apollo-angular/types';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Observable<Array<User>>;
  teams$: Observable<Array<Team>>;
  visibleModalForAddesUser = false;
  visibleModalForGenerateTeam = false;

  profileForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    nicname: new FormControl('', Validators.required),
    gameId: new FormControl('', Validators.required),
  });

  teamForm: FormGroup = new FormGroup({
    teamId: new FormControl(null),
    teamName: new FormControl(null),
    usersCount: new FormControl(5, Validators.required),
    deleteUsers: new FormControl(false),
  });

  subscription: any;

  constructor(
    private userService: UserService,
    private teamService: TeamService
  ) {
    this.users$ = userService.users$;
    this.teams$ = this.teamService.teams$;
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

  openModalForAddTeam(): void {
    this.visibleModalForGenerateTeam = true;
  }

  generateTeam(): void {
    const form = this.teamForm.getRawValue();
    this.teamService.generateTeam(this.userService.users$.getValue(), {
      teamId: +form.teamId,
      teamName: form.teamName,
      deleteUsers: form.deleteUsers,
      usersCount: form.usersCount,
    });
    this.visibleModalForGenerateTeam = false;
  }
}
