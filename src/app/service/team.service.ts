import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Team } from '../models/team';

@Injectable()
export class TeamService {
  teams$: BehaviorSubject<Array<Team>> = new BehaviorSubject<Array<Team>>([]);

  constructor(private apollo: Apollo) {}

  public subscribeToTeams$(): Observable<any> {
    const TEAMS_SUBSCRIPTION = gql`
      subscription q2 {
        Team {
          id
          name
          UsersTeamLinks {
            User {
              Name
              Id
              Nicname
              gameId
            }
          }
        }
      }
    `;

    return this.apollo
      .subscribe({
        query: TEAMS_SUBSCRIPTION,
      })
      .pipe(
        tap((res: any) => {
          const teams = res?.data?.Team?.map((m: any) => {
            return {
                id: m.id,
                name: m.name,
                users: m.UsersTeamLinks.map((mu:any) => ({
                    gameId: mu.User.gameId,
                    name: mu.User.Name,
                    id: mu.User.Id,
                    nicname: mu.User.Nicname,
                }))
              
            } as Team;
          });

          this.teams$.next(teams);
        })
      );
  }
}
