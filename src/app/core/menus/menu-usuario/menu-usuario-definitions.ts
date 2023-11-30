import { Router } from "@angular/router";
import { MensagensService } from "src/app/infra/mensagens/mensagens.service";
import { TokenService } from "src/app/infra/token/token.service";

export interface MenuUsuario {
    itens: ItemMenuUsuario[];
};

export interface ItemMenuUsuario {
    icon?: string;
    isNavegate: boolean;
    label: string;
    showIcon: boolean;
    onClick?: (...args: any[]) => void;
    navegate?: (router: Router) => void;
};

export const teste = () => {

}

export const ITEM_LOGIN: ItemMenuUsuario = {
    icon: 'pi pi-sign-in',
    isNavegate: true,
    label: 'Logar',
    showIcon: true,
    navegate: (router: Router) => {
        router.navigateByUrl("/login");
    }
};

export const ITEM_REGISTRAR: ItemMenuUsuario = {
    icon: 'pi pi-user-plus',
    isNavegate: true,
    label: 'Criar conta',
    showIcon: true,
    navegate: (router: Router) => {
        router.navigateByUrl("/register");
    }
};

export const ITEM_LOGOUT: ItemMenuUsuario = {
    icon: 'pi pi-sign-out',
    isNavegate: false,
    label: 'Sair',
    showIcon: true,
    onClick: (tokenService: TokenService, mensagemService: MensagensService) => {
        mensagemService.mostrarMensagemSimNao("Logout", "Deseja sair do sistema?", "pi pi-sign-out").then(value => {
            if (value) {
                tokenService.logout();
            }
        });
    }
};

export const ITEM_PERFIL: ItemMenuUsuario = {
    isNavegate: false,
    label: 'Perfil',
    showIcon: true,
    navegate: (router: Router) => {
        router.navigateByUrl("/carreira/perfil");
    }
};

export const ITEM_CONTRIBUICOES: ItemMenuUsuario = {
    isNavegate: false,
    label: 'Contribuições',
    showIcon: true
};

export const ITEM_VAGAS: ItemMenuUsuario = {
    isNavegate: false,
    label: 'Atividade de vagas',
    showIcon: true
};

export const MENU_USUARIO_LOGADO: MenuUsuario = {
    itens: [
        ITEM_PERFIL,
        ITEM_LOGOUT
    ]
};

export const MENU_USUARIO_DESLOGADO: MenuUsuario = {
    itens: [
        ITEM_LOGIN, ITEM_REGISTRAR
    ]
};