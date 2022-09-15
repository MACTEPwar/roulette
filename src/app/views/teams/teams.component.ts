import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { TeamService } from 'src/app/service/team.service';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  teams$: Observable<Array<Team>>;

  constructor(private teamService: TeamService) {
    this.teams$ = teamService.teams$;
  }

  ngOnInit(): void {
  }
}
