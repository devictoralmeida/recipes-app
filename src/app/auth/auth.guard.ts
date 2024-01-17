import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // Aqui caso tenhamos o user, devemos retornar um booleano, a para transformar o BehaviorSubject em boolean, precisaremos utilizar um map
    return this.authService.user.pipe(
      take(1), // Queremos apenas o primeiro valor e depois cancelar o subscribe.
      map((user) => {
        // Transformando o resultado de user em boolean com !!
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        // Fazendo redirect de user
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
