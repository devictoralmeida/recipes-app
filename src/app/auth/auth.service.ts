import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { SignUpDataDTO } from './signData.dto';
import { SignUpResponseDTO, SignInResponseDTO } from './signResponse.dto';
import { User, UserFromLocalStorage } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private signUpUrl: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDl1ttUEUv85F1XXXzYguBh_KY3za0Uly8';

  private signInUrl: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDl1ttUEUv85F1XXXzYguBh_KY3za0Uly8';

  public user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public token: string | null = null;
  private tokenExpirationTimer: any;

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknow error occurred!';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email is already in use';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid credentials';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This account is disabled';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Invalid credentials';
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(userId, email, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('@token:recipes', JSON.stringify(user));

    // Setando o tempo para autoLogout
    this.autoLogout(expiresIn * 1000); // * 1000 pq é em milisegundos
  }

  constructor(private http: HttpClient, private router: Router) {}

  public signup(data: SignUpDataDTO): Observable<SignUpResponseDTO> {
    data.returnSecureToken = true;
    return this.http.post<SignUpResponseDTO>(`${this.signUpUrl}`, data).pipe(
      catchError(this.handleError),
      tap((responseData) => {
        this.handleAuth(
          responseData.email,
          responseData.localId,
          responseData.idToken,
          +responseData.expiresIn
        );
      })
    );
  }

  public signin(data: SignUpDataDTO): Observable<SignInResponseDTO> {
    data.returnSecureToken = true;
    return this.http.post<SignInResponseDTO>(`${this.signInUrl}`, data).pipe(
      catchError(this.handleError),
      tap((responseData) => {
        this.handleAuth(
          responseData.email,
          responseData.localId,
          responseData.idToken,
          +responseData.expiresIn
        );
      })
    );
  }

  public autoLogin(): void {
    const userData: UserFromLocalStorage = JSON.parse(
      localStorage.getItem('@token:recipes')
    );

    const expirationDuration = new Date(userData._tokenExpirationDate);

    const loadedUser = new User(
      userData.id,
      userData.email,
      userData._token,
      expirationDuration
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);

      // Setando o tempo para autoLogout (tempo do token - agora)
      const tokenDurationTime = expirationDuration.getTime();
      const currentDatetime = new Date().getTime();
      const timeDiff = tokenDurationTime - currentDatetime;

      this.autoLogout(timeDiff);
    }
  }

  logout(): void {
    this.user.next(null);
    localStorage.removeItem('@token:recipes');
    this.router.navigate(['/login']);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  public autoLogout(expirationDuration: number): void {
    // Vamos setar um timer para validar o token, e também precisaremos limpar esse timer que rodará por "debaixo dos panos", por isso vamos criar a propriedade tokenExpirationTimer
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
