import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/infra/theme/theme.service';
import { ITEMS_MENU } from './menu-definition.model';

@Component({
  selector: 'app-menu-navegator',
  templateUrl: './menu-navegator.component.html',
  styleUrls: ['./menu-navegator.component.scss']
})
export class MenuNavegatorComponent {

  item: MenuItem[] = ITEMS_MENU;

  readonly form: FormGroup;
  showMenuUsuario: boolean = true;

  constructor(private themeService: ThemeService, private readonly router: Router) {
    this.form = new FormGroup({
      isBlackTheme: new FormControl(false)
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showMenuUsuario = (
          this.router.url !== "/para-empresas"
          && this.router.url !== "/para-empresas/registrar");
      }
    });
  }

  changeTheme() {
    let isBlackTheme: boolean = this.form.controls['isBlackTheme'].value;
    if (isBlackTheme) {
      this.themeService.switchTheme("lara-dark-blue")
    } else {
      this.themeService.switchTheme("lara-light-blue")
    }
  }

  getToolTipText(): string {
    return this.form.controls['isBlackTheme'].value ? "Tema claro" : "Tema escuro";
  }

  navegate(path: string) {
    this.router.navigateByUrl("/" + path)
  }

}
