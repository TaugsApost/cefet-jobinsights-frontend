import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationError, Router } from '@angular/router';
import { BackgroundService } from './infra/background/background.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jobinsights_frontend';
  bgImage = '../assets/imagens/background/background.png';

  canShowMenu: boolean = true;

  constructor(private readonly router: Router, bgService: BackgroundService, private route: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.bgImage = bgService.getBackgroudByUrl(router.url);
        if (this.router.url === "/404" || this.router.url.includes("gerenciar-empresa")) {
          this.canShowMenu = false;
        } else {
          this.canShowMenu = true;
        }
      }
      if (event instanceof NavigationError) {
        this.router.navigateByUrl("/404")
      }
    });
  }
}
