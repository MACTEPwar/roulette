import { UserService } from './service/user.service';
import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { AuthorizeService } from './service/authORIZE.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
})
export class AppComponent {
  title = 'roulette';

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public authorizeService: AuthorizeService
  ) {
    // this.auth.loginWithPopup({
    //   screen_hint: 'signup',
    // });
  }

  login(): void {
    this.authorizeService.login$().subscribe()
  }
}
