import { environment } from './../../environments/environment';
import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';

@Injectable()
export class UserService {
  users$: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);

  constructor(private httpClient: HttpClient, private apollo: Apollo) {
    apollo
      .watchQuery<any>({
        query: gql`
          query q1 {
            Users {
              Id
              Name
              Nicname
              gameId
            }
          }
        `,
      })
      .valueChanges.subscribe((res) => console.log('res', res));
  }

  public subscribeToUsers$(): Observable<any> {
    // return of();
    const USERS_SUBSCRIPTION = gql`
      subscription s1 {
        Users {
          Id
          Name
          Nicname
          gameId
        }
      }
    `;

    return this.apollo.subscribe({
      query: USERS_SUBSCRIPTION,
    }).pipe(tap((res:any) => {
      const users = res?.data?.Users?.map((m: any) => {
        return {
          gameId: m.gameId,
          name: m.Name,
          id: m.Id,
          nicname: m.Nicname,
        } as User;
      });

      this.users$.next(users);
    })) 
  }

  public getAllUsers(): void {
    const query: string = `
        query q1 {
            Users {
                Id
                Name
                Nicname
                gameId
            }
        }
    `;

    this.httpClient
      .post(environment.apiUrl, { query }, { headers: this.getHeaders() })
      .subscribe((res: any) => {
        const users = res?.data?.Users?.map((m: any) => {
          return {
            gameId: m.gameId,
            name: m.Name,
            id: m.Id,
            nicname: m.Nicname,
          } as User;
        });

        this.users$.next(users);
      });
  }

  public addUser(user: User): void {
    const mutation: string = `
        mutation m1 {
            insert_Users_one(object: {Name: "${user.name}", Nicname: "${user.nicname}", gameId: "${user.gameId}"}) {
                Id
            }
        }
    `;

    this.httpClient
      .post(environment.apiUrl, { query: mutation }, { headers: this.getHeaders() })
      .subscribe((res: any) => {
        this.getAllUsers();
      });
  }

  public deleteUser(id: number): void {
    const mutation: string = `
        mutation m1 {
            delete_Users_by_pk(Id: ${id}) {
                Id
            }
        }
    `;

    this.httpClient
      .post(environment.apiUrl, { query: mutation }, { headers: this.getHeaders() })
      .subscribe((res: any) => {
        this.getAllUsers();
      });
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append(
      'x-hasura-admin-secret',
      'sxy14YqatWgISVnWm6ujuJeRKODP2XhCjpUZelo0Dg22oVqd0Wn1CQnOc5AGhJeI'
    );
    headers = headers.append('content-type', 'application/json');

    return headers;
  }
}
