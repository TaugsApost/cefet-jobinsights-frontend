import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaComponent } from './empresa.component';
import { DetalheListEmpresaComponent } from './detalhe-list-empresa/detalhe-list-empresa.component';
import { PrimengModule } from 'src/app/infra/primeng/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpresaDetalheComponent } from './empresa-detalhe/empresa-detalhe.component';
import { VisaoGeralEmpresaComponent } from './empresa-detalhe/visao-geral-empresa/visao-geral-empresa.component';
import { AvaliacoesEmpresaComponent } from './empresa-detalhe/avaliacoes-empresa/avaliacoes-empresa.component';
import { SalariosEmpresaComponent } from './empresa-detalhe/salarios-empresa/salarios-empresa.component';
import { VagasEmpresaComponent } from './empresa-detalhe/vagas-empresa/vagas-empresa.component';
import { CadastroModule } from '../cadastro/cadastro.module';
import { AvaliacaoCardComponent } from './empresa-detalhe/avaliacoes-empresa/avaliacao-card/avaliacao-card.component';
import { VagasModule } from '../vagas/vagas.module';



@NgModule({
  declarations: [
    EmpresaComponent,
    DetalheListEmpresaComponent,
    EmpresaDetalheComponent,
    VisaoGeralEmpresaComponent,
    AvaliacoesEmpresaComponent,
    SalariosEmpresaComponent,
    VagasEmpresaComponent,
    AvaliacaoCardComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    CadastroModule,
    VagasModule
  ],
  exports: [
    DetalheListEmpresaComponent
  ],
  schemas: [
    //CUSTOM_ELEMENTS_SCHEMA
    NO_ERRORS_SCHEMA
  ]
})
export class EmpresaModule { }
