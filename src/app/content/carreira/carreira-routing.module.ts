import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmpresaDetalheComponent } from "../empresa/empresa-detalhe/empresa-detalhe.component";
import { EmpresaComponent } from "../empresa/empresa.component";
import { VagasComponent } from "./vagas/vagas.component";
import { CarreiraComponent } from "./carreira.component";
import { PerfilComponent } from "./perfil/perfil.component";

const routes: Routes = [
    {
        path: '',
        component: CarreiraComponent,
        children: [
            {
                path: 'empresas',
                component: EmpresaComponent
            },
            {
                path: 'vagas',
                component: VagasComponent
            },
            {
                path: 'empresas/detalhe',
                component: EmpresaDetalheComponent
            },
            {
                path: 'perfil',
                component: PerfilComponent
            },
            {
                path: '',
                redirectTo: 'vagas',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarreiraRoutingModule {

}