import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
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
    DropdownModule
  ],
  providers: [UserService, TeamService],
  bootstrap: [AppComponent],
})
export class AppModule {}
