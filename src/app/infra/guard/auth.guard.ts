import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private router: Router, private tokenService: TokenService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.tokenService.isLoggin()) {
            return true;
        } else {
            const role = this.tokenService.getTokenDTO().role;
            if (role === "ALUNO_ROLE") {
                this.router.navigate(['/carreira']);
            } else {
                this.router.navigate(['/gerenciar-empresa']);
            }
            return false;
        }
    }
}