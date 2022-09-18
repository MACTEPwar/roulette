import { map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, concatMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';

@Injectable()
export class AuthorizeService {
  isAuthenticated$: Observable<boolean>;
  currentUser: User | undefined;
  metadata = {};
  currentUserId: string | null = null;

  constructor(public auth: AuthService, private http: HttpClient) {
    this.isAuthenticated$ = this.auth.isAuthenticated$;
  }

  login$(): Observable<any> {
    return this.auth
      .loginWithPopup({
        scope: 'read:current_user read:roles read:role_members read:users',
      })
      .pipe(
        switchMap((sw) => this.auth.getUser()),
        tap((user) => {
          this.currentUser = user;
          console.log('currentUser', this.currentUser);
        }),
        switchMap((sw) => this.getUserMetadata$()),
        switchMap((sw) => this.getUserRoles$()),
        tap((res) => console.log('roles', res))
      );
    // return this.auth.loginWithRedirect();
  }

  getUserMetadata$(): Observable<any> {
    return this.auth.user$.pipe(
      concatMap((user) =>
        // Use HttpClient to make the call
        this.http.get(
          encodeURI(
            `https://dev-ob-i3qc4.us.auth0.com/api/v2/users/${user!.sub}`
          )
        )
      ),
      // map((m: any) => m.user_metadata),
      tap((meta: any) => {
        // this.metadata = meta;
        this.currentUserId = meta.identities.find(
          (f: any) => f.provider === 'auth0'
        ).user_id;
        console.log(this.currentUserId);
      })
    );
  }

  register$(): Observable<any> {
    return this.auth.loginWithPopup({
      screen_hint: 'signup',
    });
  }

  logout(): void {
    this.auth.logout({ returnTo: document.location.origin });
  }

  getUserRoles$(): Observable<any> {
    // this.auth.getUser();
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((apiToken) => {
        return this.http.get(
          `https://dev-ob-i3qc4.us.auth0.com/api/v2/users/${this.currentUserId}/roles`,
          {
            headers: new HttpHeaders().set(
              'Authorization',
              `Bearer ${apiToken}`
            ),
          }
        );
      })
    );
    // .subscribe((res) => console.log('roles', res));
  }
}
