import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SenhaValidator, VALIDAR_ESPECIAL, VALIDAR_LOWER, VALIDAR_NUMERO, VALIDAR_TAMANHO, VALIDAR_UPPER } from '../validators/senha/senha-validator';
import { SelectItem } from 'primeng/api';
import { SetorService } from 'src/app/service/setor.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { MensagensService } from 'src/app/infra/mensagens/mensagens.service';
import { Empresa } from 'src/app/model/entity/empresa.model';
import { Setor } from 'src/app/model/entity/setor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-empresas',
  templateUrl: './registrar-empresas.component.html',
  styleUrls: ['./registrar-empresas.component.scss']
})
export class RegistrarEmpresasComponent {

  readonly form: FormGroup;
  senhaValidators: SenhaValidator[] = [];
  senha: string = "";
  outroSetor: boolean = false;
  listaSetores: SelectItem[] = [];
  listaTamanhos: SelectItem[] = [];

  constructor(
    private readonly setorService: SetorService,
    private readonly usuarioService: UsuarioService,
    private readonly mensagemService: MensagensService,
    private readonly router: Router
  ) {
    this.form = new FormGroup({
      login: new FormControl('', Validators.required),
      senha: new FormControl('', [Validators.required, this.senhaValidator.bind(this)]),
      confirmarSenha: new FormControl('', [Validators.required, this.confirmarSenhaValidator.bind(this)]),
      email: new FormControl('', Validators.required),
      nome: new FormControl('', Validators.required),
      telefone: new FormControl(''),
      celular: new FormControl(''),
      idSetor: new FormControl(null, Validators.required),
      setor: new FormControl(null),
      tamanho: new FormControl(null, Validators.required),
      descricao: new FormControl('', Validators.required),
      //
      novoSetor: new FormControl('')
    });
    this.form.controls['senha'].valueChanges.subscribe(senha => {
      this.senha = senha;
      this.form.controls['confirmarSenha'].updateValueAndValidity();
    })
    this.initLists();
  }

  private initLists() {
    this.senhaValidators = [
      VALIDAR_UPPER,
      VALIDAR_LOWER,
      VALIDAR_NUMERO,
      VALIDAR_ESPECIAL,
      VALIDAR_TAMANHO
    ];
    this.setorService.listarTodos().subscribe(listaSetores => {
      listaSetores.forEach(setor => {
        this.listaSetores.push(
          {
            'label': setor.nome,
            'value': setor.id
          }
        );
      })
      this.listaSetores.push(
        {
          label: "Outro",
          value: -1
        }
      );
    })
    this.listaTamanhos = [
      {
        value: 1,
        label: '< 500 Funcionários'
      },
      {
        value: 2,
        label: '500 - 1000 Funcionários'
      },
      {
        value: 3,
        label: '1000 - 5000 Funcionários'
      },
      {
        value: 4,
        label: '5000 - 10000 Funcionários'
      },
      {
        value: 5,
        label: '> 10000 Funcionários'
      }
    ]
  }

  validarSenha(senhaValidators: SenhaValidator): string {
    return senhaValidators.validar(this.form.controls['senha'].value);
  }

  senhaValidator(control: FormControl): { [key: string]: boolean } | null {
    let valid: boolean = true;
    const senha = control.value;
    this.senhaValidators.forEach(validator => {
      if (!validator.valid(senha)) {
        valid = false
      }
    })
    if (!valid) {

      return { 'senhaInvalida': true };
    }
    return null;
  }

  confirmarSenhaValidator(control: FormControl): { [key: string]: boolean } | null {
    const confirmarSenha: string = control.value;

    if (confirmarSenha === this.senha) {
      return null;
    } else {
      return { 'senhaInvalida': true };
    }
  }

  onChangeSetor(event: any) {
    if (event.value === -1) {
      this.outroSetor = true;
      this.form.get('novoSetor')?.setValidators(Validators.required);
    } else {
      this.outroSetor = false;
      this.form.get('novoSetor')?.clearValidators();
    }
    this.form.get('novoSetor')?.updateValueAndValidity();
  }

  limpar() {
    this.outroSetor = false;
    this.form.controls['login'].setValue("");
    this.form.controls['senha'].setValue("");
    this.form.controls['confirmarSenha'].setValue("");
    this.form.controls['email'].setValue("");
    this.form.controls['nome'].setValue("");
    this.form.controls['idSetor'].setValue(null);
    this.form.controls['telefone'].setValue("");
    this.form.controls['celular'].setValue("");
    this.form.controls['novoSetor'].setValue("");
    this.form.controls['tamanho'].setValue(null);
    this.form.controls['descricao'].setValue("");

    this.form.controls['novoSetor'].clearAsyncValidators();

    this.form.updateValueAndValidity();
  }

  salvar() {
    this.beforeSave();
    if (this.form.valid) {
      let empresa: Empresa = this.form.getRawValue() as Empresa;

      this.mensagemService.mostrarMensagemSimNao("Cadastro", "Você irá criar uma conta no JobInsights. Deseja prosseguir?").then(value => {
        if (value) {
          this.usuarioService.salvarEmpresa(empresa).subscribe(empresa => {
            this.mensagemService.mostrarMensagemComRetorno("Sucesso", "Usuário criado com sucesso").then(value => {
              this.navegar();
            })
          }, erro => {
            this.mensagemService.mostrarMensagemComRetorno("Falha", erro.error).then(value => {

            })
          })
        }
      });

    } else {
      this.mensagemService.mostrarMensagemComRetorno("Erro", "Preencha o formulario corretamente").then(value => {

      })
    }
  }

  private beforeSave() {
    if (this.form.get('idSetor')?.value === -1) {
      const setor: Setor = new Setor();
      setor.nome = this.form.get('novoSetor')?.value;
      this.form.get('setor')?.setValue(setor);
    }
  }
  navegar() {
    this.router.navigateByUrl('/login');
  }
}
