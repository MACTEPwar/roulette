import { UserService } from './service/user.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
})
export class AppComponent {
  title = 'roulette';

  constructor() {}
}
