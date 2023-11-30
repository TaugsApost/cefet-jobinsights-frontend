import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { MensagensService } from 'src/app/infra/mensagens/mensagens.service';
import { TokenService } from 'src/app/infra/token/token.service';
import { Empresa } from 'src/app/model/entity/empresa.model';
import { Salario } from 'src/app/model/entity/salario.model';
import { CargoService } from 'src/app/service/cargo.service';
import { SalarioService } from 'src/app/service/salario.service';

@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.scss']
})
export class SalarioComponent {

  @Input() empresa: Empresa = new Empresa();
  @Input() display: boolean = false;
  @Output() exit: EventEmitter<any> = new EventEmitter;
  @Output() salarioSalvo: EventEmitter<any> = new EventEmitter;
  readonly form: FormGroup;
  listaCargo: SelectItem[] = [];

  constructor(
    private readonly tokenService: TokenService,
    private readonly mensagemService: MensagensService,
    private readonly salarioService: SalarioService,
    private readonly cargoService: CargoService
  ) {
    this.form = new FormGroup({
      idAluno: new FormControl(null, Validators.required),
      idEmpresa: new FormControl(null, Validators.required),
      valor: new FormControl(0, Validators.required),
      nomeEmpresa: new FormControl(),
      idCargo: new FormControl(null, Validators.required)
    });
  }

  fecharModal() {
    this.display = false
    this.exit.emit();
  }

  inicializar() {
    this.listaCargo = [];
    this.form.reset();
    this.form.get('nomeEmpresa')?.setValue(this.empresa.nome);
    this.form.get('idEmpresa')?.setValue(this.empresa.id);
    this.form.get('idAluno')?.setValue(this.tokenService.getTokenDTO().id);
    this.cargoService.listarTodos().subscribe(cargos => {
      cargos.forEach(cargo => {
        this.listaCargo.push(
          {
            value: cargo.id,
            label: cargo.nome
          }
        );
      });
    })
  }

  salvar() {
    if (this.form.valid) {
      const salario: Salario = this.form.getRawValue() as Salario;
      this.mensagemService.mostrarMensagemSimNao("Cadastro", "Deseja prosseguir com a operação?").then(value => {
        if (value) {
          this.salarioService.salvar(salario).subscribe(response => {
            this.mensagemService.mostrarMensagemComRetorno("Sucesso", "Salário salvo com sucesso").then(value => {
              this.display = false;
              this.salarioSalvo.emit();
            })
          })
        }
      })
    }
  }

}
