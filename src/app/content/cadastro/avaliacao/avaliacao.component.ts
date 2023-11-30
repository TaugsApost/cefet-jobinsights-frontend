import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MensagensService } from 'src/app/infra/mensagens/mensagens.service';
import { TokenService } from 'src/app/infra/token/token.service';
import { Avaliacao } from 'src/app/model/entity/avaliacoes.model';
import { Empresa } from 'src/app/model/entity/empresa.model';
import { AvaliacaoService } from 'src/app/service/avaliacao.service';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent {

  @Input() empresa: Empresa = new Empresa();
  @Input() display: boolean = false;
  @Output() exit: EventEmitter<any> = new EventEmitter;
  @Output() avaliacaoSalva: EventEmitter<any> = new EventEmitter;
  readonly form: FormGroup

  constructor(
    private readonly tokenService: TokenService,
    private readonly mensagemService: MensagensService,
    private readonly avaliacaoService: AvaliacaoService
  ) {
    this.form = new FormGroup({
      idAluno: new FormControl(null, Validators.required),
      idEmpresa: new FormControl(null, Validators.required),
      nota: new FormControl('', Validators.required),
      titulo: new FormControl('', Validators.required),
      pros: new FormControl('', Validators.required),
      contra: new FormControl('', Validators.required),
      nomeEmpresa: new FormControl()
    });
  }

  fecharModal() {
    this.display = false
    this.exit.emit();
  }

  inicializar() {
    this.form.reset();
    this.form.get('nomeEmpresa')?.setValue(this.empresa.nome);
    this.form.get('idEmpresa')?.setValue(this.empresa.id);
    this.form.get('idAluno')?.setValue(this.tokenService.getTokenDTO().id);
  }

  salvar() {
    if (this.form.valid) {
      const avaliacao: Avaliacao = this.form.getRawValue() as Avaliacao;
      this.mensagemService.mostrarMensagemSimNao("Cadastro", "Deseja prosegguir com a operação?").then(value => {
        if (value) {
          this.avaliacaoService.salvar(avaliacao).subscribe(response => {
            this.mensagemService.mostrarMensagemComRetorno("Sucesso", "Avaliação salva com sucesso").then(value => {
              this.display = false;
              this.avaliacaoSalva.emit();
            })

          })
        }
      })
    }
  }



}
