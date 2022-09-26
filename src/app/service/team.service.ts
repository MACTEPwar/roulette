import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {
  BehaviorSubject,
  Observable,
  tap,
  map,
  from,
  of,
  defer,
  EMPTY,
} from 'rxjs';
import { Team } from '../models/team';
import { IUser } from '../models/user';
import { switchMap, take } from 'rxjs/operators';

@Injectable()
export class TeamService {
  teams$: BehaviorSubject<Array<Team>> = new BehaviorSubject<Array<Team>>([]);

  constructor(private apollo: Apollo) {
    this.subscribeToTeams$().subscribe();
  }

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
              Nickname
              ServerId
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
              users: m.UsersTeamLinks.map((mu: any) => ({
                serverId: mu.User.ServerId,
                name: mu.User.Name,
                id: mu.User.Id,
                nickname: mu.User.Nickname,
              })),
            } as Team;
          });

          this.teams$.next(teams);
        })
      );
  }

  generateTeam(
    users: IUser[],
    model: {
      teamId: number;
      teamName: string;
      usersCount: number;
      deleteUsers: boolean;
    }
  ): void {
    users = this.getRandomUsers(users, model.usersCount);
    // тут бы проверить, готовы ли они играть?
    if (model.teamId === null) {
      //this create new team
      this.createTeam$(
        model.teamName,
        users.map((m) => m.id!)
      ).subscribe();
    } else {
      //this update team
      this.addUsersToTeam$(
        model.teamId,
        users.map((m) => m.id!),
        model.deleteUsers
      ).subscribe(console.log);
    }
  }

  createTeam$(name: string, userIds: number[]): Observable<any> {
    return this.apollo
      .mutate({
        mutation: gql`
        mutation m1 {
          insert_Team(
            objects: {
              name: "${name}"
              UsersTeamLinks: {
                data: ${JSON.stringify(userIds.map((m) => ({ userId: m })))}
              }
            }
          ) {
            returning {
              id
            }
          }
        }
      `,
      })
      .pipe(take(1));
  }

  addUsersToTeam$(
    id: number,
    userIds: number[],
    deleteingUsers: boolean = false
  ): Observable<any> {
    return of(deleteingUsers).pipe(
      switchMap((sw) => {
        if (sw === true) {
          return this.clearTeam$(id);
        } else {
          return of(null);
        }
      }),
      switchMap((sw) => {
        const data = JSON.stringify(
          userIds.map((m) => {
            return {
              teamId: +id,
              userId: +m,
            };
          })
        );
        const gqlMut = gql`
          mutation m4($items: [UsersTeamLink_insert_input!]!) {
            insert_UsersTeamLink(objects: $items) {
              returning {
                id
              }
            }
          }
        `;
        return this.apollo.mutate({
          mutation: gqlMut,
          variables: {
            items: userIds.map((m) => {
              return {
                teamId: +id,
                userId: +m,
              };
            }),
          },
        });
      })
    );
  }

  clearTeam$(teamId: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation m2 {
          delete_UsersTeamLink(where: { teamId: { _eq: ${teamId} } }) {
            returning {
              id
            }
          }
        }
      `,
    });
  }

  getRandomUsers(users: IUser[], count: number): IUser[] {
    var result = new Array(count),
      len = users.length,
      taken = new Array(len);
    if (count > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (count--) {
      var x = Math.floor(Math.random() * len);
      result[count] = users[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
}
