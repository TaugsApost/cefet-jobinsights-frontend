import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { VALIDAR_UPPER, VALIDAR_LOWER, VALIDAR_NUMERO, VALIDAR_ESPECIAL, VALIDAR_TAMANHO, SenhaValidator } from 'src/app/core/validators/senha/senha-validator';
import { MensagensService } from 'src/app/infra/mensagens/mensagens.service';
import { TokenService } from 'src/app/infra/token/token.service';
import { Empresa } from 'src/app/model/entity/empresa.model';
import { Setor } from 'src/app/model/entity/setor.model';
import { EmpresaService } from 'src/app/service/empresa.service';
import { SetorService } from 'src/app/service/setor.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  readonly form: FormGroup;
  senhaValidators: SenhaValidator[] = [];
  senha: string = "";
  outroSetor: boolean = false;
  listaSetores: SelectItem[] = [];
  listaTamanhos: SelectItem[] = [];

  constructor(
    private readonly empresaService: EmpresaService,
    private readonly tokenService: TokenService,
    private readonly setorService: SetorService,
    private readonly usuarioService: UsuarioService,
    private readonly mensagemService: MensagensService
  ) {
    this.form = new FormGroup({
      id: new FormControl({ value: null, disabled: true }, Validators.required), //
      login: new FormControl(Validators.required), //
      senha: new FormControl(Validators.required),
      novaSenha: new FormControl(''), //?
      confirmarSenha: new FormControl(''), //?
      email: new FormControl('', Validators.required), //
      nome: new FormControl(Validators.required), //
      confirmacaoEmail: new FormControl({ value: null, disabled: true }, Validators.required), //
      role: new FormControl({ value: null, disabled: true }, Validators.required), //
      descricao: new FormControl('', Validators.required), //
      tamanho: new FormControl(null, Validators.required), //
      idSetor: new FormControl(null, Validators.required), //
      setor: new FormControl(), //
      salarios: new FormControl({ value: null, disabled: true }, Validators.required), //
      avaliacoes: new FormControl({ value: null, disabled: true }, Validators.required), // 
      vagas: new FormControl({ value: null, disabled: true }, Validators.required), //
      novoSetor: new FormControl('')//
    })
    this.form.controls['novaSenha'].valueChanges.subscribe(senha => {
      if ((senha as string).length > 0) {
        this.senha = senha;
        this.form.controls['novaSenha'].setValidators([Validators.required, this.senhaValidator.bind(this)]);
        this.form.controls['confirmarSenha'].setValidators([Validators.required, this.confirmarSenhaValidator.bind(this)]);
      } else {
        this.form.controls['novaSenha'].clearValidators();
        this.form.controls['confirmarSenha'].clearValidators();
        this.form.controls['confirmarSenha'].setValue("");
      }
      //this.form.controls['novaSenha'].updateValueAndValidity();
      this.form.controls['confirmarSenha'].updateValueAndValidity();
    })
    this.initLists();
  }

  ngOnInit(): void {
    const id = this.tokenService.getTokenDTO().id;
    this.empresaService.detalhar(id).subscribe(empresa => {
      this.form.patchValue(empresa);
    });
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

  private initLists() {
    this.listaTamanhos = [];
    this.listaSetores = [];
    this.senhaValidators = [];
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

  validarSenha(senhaValidators: SenhaValidator): string {
    return senhaValidators.validar(this.form.controls['novaSenha'].value);
  }

  private beforeSave(): boolean {
    if (this.form.valid) {
      if ((this.form.get('novaSenha')?.value as string).length > 0) {
        this.form.get(this.senha)?.setValue(this.form.get('novaSenha')?.value);
      }
      if (this.form.get('idSetor')?.value === -1) {
        const setor: Setor = new Setor();
        setor.nome = this.form.get('novoSetor')?.value;
        this.form.get('setor')?.setValue(setor);
      }
      return true;
    }
    return false;
  }

  salvar() {
    if (this.beforeSave()) {
      this.mensagemService.mostrarMensagemSimNao("Aviso", "Alguns de seus dados podem ser alterados ao confirmar esta operação. Deseja prosseguir?").then(response => {
        if (response) {
          const empresa: Empresa = this.form.getRawValue() as Empresa;
          if (this.form.get('novaSenha')?.value.length > 0) {
            empresa.senha = this.form.get('novaSenha')?.value;
          }
          this.usuarioService.editarEmpresa(empresa).subscribe(empresa => {
            this.initLists();
            this.mensagemService.mostrarMensagemComRetorno("Sucesso", "Dados alterados com sucesso").then(response => {
              this.form.get('novoSetor')?.reset();
              this.outroSetor = false;
              this.form.get('novaSenha')?.setValue("");
              this.form.get('novaSenha')?.clearValidators();
              this.form.get('confirmarSenha')?.setValue("");
              this.form.get('confirmarSenha')?.clearValidators();
              this.form.get('novaSenha')?.updateValueAndValidity();
              this.form.get('confirmarSenha')?.updateValueAndValidity();
              this.form.patchValue(empresa);
            })
          });
        }
      })
    }
  }


}
