import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { SenhaValidator, VALIDAR_ESPECIAL, VALIDAR_LOWER, VALIDAR_NUMERO, VALIDAR_TAMANHO, VALIDAR_UPPER } from 'src/app/core/validators/senha/senha-validator';
import { MensagensService } from 'src/app/infra/mensagens/mensagens.service';
import { TokenService } from 'src/app/infra/token/token.service';
import { Cargo } from 'src/app/model/entity/cargo.model';
import { Curso } from 'src/app/model/entity/curso.model';
import { Empresa } from 'src/app/model/entity/empresa.model';
import { Aluno } from 'src/app/model/entity/usuario.model';
import { AlunoService } from 'src/app/service/aluno.service';
import { CargoService } from 'src/app/service/cargo.service';
import { CursoService } from 'src/app/service/curso.service';
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
  outroCurso: boolean = false;
  outroCargo: boolean = false;
  listaCargos: SelectItem[] = [];
  listaCursos: SelectItem[] = [];

  constructor(
    private readonly tokenService: TokenService,
    private readonly cargoService: CargoService,
    private readonly cursoService: CursoService,
    private readonly usuarioService: UsuarioService,
    private readonly mensagemService: MensagensService,
    private readonly alunoService: AlunoService
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
      idCargo: new FormControl(null),
      telefone: new FormControl(''),
      celular: new FormControl(''),
      idCurso: new FormControl(null, Validators.required),
      anoIngresso: new FormControl(null),
      anoFormatura: new FormControl(null),
      cargo: new FormControl(),
      curso: new FormControl(),
      salarios: new FormControl({ value: null, disabled: true }, Validators.required), //
      avaliacoes: new FormControl({ value: null, disabled: true }, Validators.required), //
      novoCargo: new FormControl(''),
      novoCurso: new FormControl(''),
      listaVagasCandidatadas: new FormControl()
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
      this.form.controls['confirmarSenha'].updateValueAndValidity();
    })
    this.initLists();
  }

  ngOnInit(): void {
    const id = this.tokenService.getTokenDTO().id;
    this.alunoService.detalhar(id).subscribe(aluno => {
      this.form.patchValue(aluno);
    });
  }

  onChangeCargo(event: any) {
    if (event.value === -1) {
      this.outroCargo = true;
      this.form.get('novoCargo')?.setValidators(Validators.required);
    } else {
      this.outroCargo = false;
      this.form.get('novoCargo')?.clearValidators();
    }
    this.form.get('novoCargo')?.updateValueAndValidity();
  }

  onChangeCurso(event: any) {
    if (event.value === -1) {
      this.outroCurso = true;
      this.form.get('novoCurso')?.setValidators(Validators.required);
    } else {
      this.outroCurso = false;
      this.form.get('novoCurso')?.clearValidators();
    }
    this.form.get('novoCurso')?.updateValueAndValidity();
  }

  private initLists() {
    this.senhaValidators = [];
    this.senhaValidators = [
      VALIDAR_UPPER,
      VALIDAR_LOWER,
      VALIDAR_NUMERO,
      VALIDAR_ESPECIAL,
      VALIDAR_TAMANHO
    ];
    this.cargoService.listarTodos().subscribe(lista => {
      lista.forEach(cargo => {
        this.listaCargos.push(
          {
            'label': cargo.nome,
            'value': cargo.id
          }
        );
      })
      this.listaCargos.push(
        {
          label: "Outro",
          value: -1
        }
      );
    })
    this.cursoService.listarTodos().subscribe(lista => {
      lista.forEach(curso => {
        this.listaCursos.push(
          {
            'label': curso.nome,
            'value': curso.id
          }
        );
      })
      this.listaCursos.push(
        {
          label: "Outro",
          value: -1
        }
      );
    })

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
      if (this.form.get('idCargo')?.value === -1) {
        const cargo: Cargo = new Cargo();
        cargo.nome = this.form.get('novoCargo')?.value;
        this.form.get('cargo')?.setValue(cargo);
      }
      if (this.form.get('idCurso')?.value === -1) {
        const curso: Curso = new Curso();
        curso.nome = this.form.get('novoCurso')?.value;
        this.form.get('curso')?.setValue(curso);
      }
      return true;
    }
    return false;
  }

  salvar() {
    if (this.beforeSave()) {
      this.mensagemService.mostrarMensagemSimNao("Aviso", "Alguns de seus dados podem ser alterados ao confirmar esta operação. Deseja prosseguir?").then(response => {
        if (response) {
          const aluno: Aluno = this.form.getRawValue() as Aluno;
          if (this.form.get('novaSenha')?.value.length > 0) {
            aluno.senha = this.form.get('novaSenha')?.value;
          }
          this.usuarioService.editarAluno(aluno).subscribe(aluno => {
            this.initLists();
            this.mensagemService.mostrarMensagemComRetorno("Sucesso", "Dados alterados com sucesso").then(response => {
              this.form.get('novoSetor')?.reset();
              this.outroCargo = false;
              this.outroCurso = false;
              this.form.get('novaSenha')?.setValue("");
              this.form.get('novaSenha')?.clearValidators();
              this.form.get('confirmarSenha')?.setValue("");
              this.form.get('confirmarSenha')?.clearValidators();
              this.form.get('novaSenha')?.updateValueAndValidity();
              this.form.get('confirmarSenha')?.updateValueAndValidity();
              this.form.patchValue(aluno);
            })
          });
        }
      })
    }
  }



}
