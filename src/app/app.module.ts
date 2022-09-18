import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from './core/graph-ql/graph-ql.module';
import { UsersComponent } from './views/users/users.component';
import { UserService } from './service/user.service';
import { TeamsComponent } from './views/teams/teams.component';
import { TeamService } from './service/team.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { AuthorizeService } from './service/authORIZE.service';

@NgModule({
  declarations: [AppComponent, UsersComponent, TeamsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    DialogModule,
    BrowserAnimationsModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    InputNumberModule,
    CheckboxModule,
    DropdownModule,
    AuthModule.forRoot({
      domain: 'dev-ob-i3qc4.us.auth0.com',
      clientId: 'q3krDNW3sr1Plo5rcLrMqsdRJVTvuJPG',
      audience: 'https://dev-ob-i3qc4.us.auth0.com/api/v2/',
      scope: 'read:current_user read:roles read:role_members read:users',

      // Specify configuration for the interceptor
      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
            uri: 'https://dev-ob-i3qc4.us.auth0.com/api/v2/*',
            tokenOptions: {
              // The attached token should target this audience
              audience: 'https://dev-ob-i3qc4.us.auth0.com/api/v2/',

              // The attached token should have these scopes
              scope:
                'read:current_user read:roles read:role_members read:users',
            },
          },
        ],
      },
    }),
  ],
  providers: [
    UserService,
    TeamService,
    AuthorizeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
