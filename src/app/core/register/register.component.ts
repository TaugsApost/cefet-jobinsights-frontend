import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { reduce } from 'rxjs';
import { USER_KEY } from 'src/app/infra/storage/storage-definitions';
import { StorageService } from 'src/app/infra/storage/storage.service';
import { SenhaValidator, VALIDAR_ESPECIAL, VALIDAR_LOWER, VALIDAR_NUMERO, VALIDAR_TAMANHO, VALIDAR_UPPER } from '../validators/senha/senha-validator';
import { of, Observable } from 'rxjs';
import { debounceTime, map, catchError, switchMap } from 'rxjs/operators';
import { CursoService } from 'src/app/service/curso.service';
import { CargoService } from 'src/app/service/cargo.service';
import { SelectItem } from 'primeng/api';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Aluno } from 'src/app/model/entity/usuario.model';
import { Cargo } from 'src/app/model/entity/cargo.model';
import { Curso } from 'src/app/model/entity/curso.model';
import { MensagensService } from 'src/app/infra/mensagens/mensagens.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  readonly form: FormGroup;
  formNome: FormGroup;
  senhaValidators: SenhaValidator[] = [];
  senha: string = "";
  trabalha: boolean = false;
  outroCargo: boolean = false;
  outroCurso: boolean = false;
  listaCargos: SelectItem[] = [];
  listaCursos: SelectItem[] = [];


  constructor(
    private readonly router: Router,
    private readonly cursoService: CursoService,
    private readonly cargoService: CargoService,
    private readonly usuarioService: UsuarioService,
    private readonly mensagemService: MensagensService
  ) {
    this.initLists();
    this.form = new FormGroup({
      login: new FormControl('', Validators.required),
      senha: new FormControl('', [Validators.required, this.senhaValidator.bind(this)]),
      confirmarSenha: new FormControl('', [Validators.required, this.confirmarSenhaValidator.bind(this)]),
      email: new FormControl('', Validators.required),
      nome: new FormControl('', Validators.required),
      idCargo: new FormControl(null),
      trabalha: new FormControl(false),
      telefone: new FormControl(''),
      celular: new FormControl(''),
      idCurso: new FormControl(null, Validators.required),
      anoIngresso: new FormControl(null),
      anoFormatura: new FormControl(null),
      cargo: new FormControl(),
      curso: new FormControl(),
      //
      novoCargo: new FormControl(''),
      novoCurso: new FormControl('')
    });
    this.formNome = new FormGroup({
      nome: new FormControl('', Validators.required),
      sobrenome: new FormControl('', Validators.required)
    });
    this.form.controls['senha'].valueChanges.subscribe(senha => {
      this.senha = senha;
      this.form.controls['confirmarSenha'].updateValueAndValidity();
    })
    this.form.controls['trabalha'].valueChanges.subscribe(value => {
      this.trabalha = value;
      if (!value) {
        this.form.controls['idCargo'].setValue(null);
      }
      this.onChangeCargo({ value: this.form.controls['idCargo'].value });
      this.form.controls['idCargo'].updateValueAndValidity();
    })
  }

  private initLists() {
    this.senhaValidators = [
      VALIDAR_UPPER,
      VALIDAR_LOWER,
      VALIDAR_NUMERO,
      VALIDAR_ESPECIAL,
      VALIDAR_TAMANHO
    ];

    this.cargoService.listarTodos().subscribe(list => {
      list.forEach(cargo => {
        this.listaCargos = this.listaCargos.concat(
          {
            label: cargo.nome,
            value: cargo.id
          }
        );
      })
      this.listaCargos = this.listaCargos.concat(
        {
          label: "Outro",
          value: -1
        }
      );
    });
    this.cursoService.listarTodos().subscribe(list => {
      list.forEach(curso => {
        this.listaCursos = this.listaCursos.concat(
          {
            label: curso.nome,
            value: curso.id
          }
        );
      })
      this.listaCursos = this.listaCursos.concat(
        {
          label: "Outro",
          value: -1
        }
      );
    });

  }

  cadastrar() {
    let user = this.form.getRawValue();
    StorageService.saveObject(USER_KEY, user);
  }

  navegar() {
    this.router.navigateByUrl('/login');
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

  salvar() {
    this.beforeSave();
    if (this.form.valid) {
      let aluno: Aluno = this.form.getRawValue() as Aluno;
      this.usuarioService.salvarAluno(aluno).subscribe(aluno => {
        this.mensagemService.mostrarMensagemComRetorno("Sucesso", "Usuário criado com sucesso").then(value => {
          this.navegar();
        })
      })
    } else {
      this.mensagemService.mostrarMensagemComRetorno("Erro", "Preencha o formulario corretamente").then(value => {

      })
    }
  }

  limpar() {
    this.outroCargo = false;
    this.outroCurso = false;
    this.form.controls['login'].setValue("");
    this.form.controls['senha'].setValue("");
    this.form.controls['confirmarSenha'].setValue("");
    this.form.controls['email'].setValue("");
    this.form.controls['nome'].setValue("");
    this.form.controls['idCargo'].setValue(null);
    this.form.controls['trabalha'].setValue(false);
    this.form.controls['telefone'].setValue("");
    this.form.controls['celular'].setValue("");
    this.form.controls['idCurso'].setValue(null);
    this.form.controls['anoIngresso'].setValue("");
    this.form.controls['anoFormatura'].setValue("");
    this.form.controls['novoCargo'].setValue("");
    this.form.controls['novoCurso'].setValue("");

    this.form.controls['novoCargo'].clearAsyncValidators();
    this.form.controls['novoCurso'].clearAsyncValidators();

    this.form.updateValueAndValidity();
    this.formNome.reset();
  }

  private beforeSave() {
    if (this.formNome.valid) {
      let nome: string = this.formNome.controls['nome'].value + ' ' + this.formNome.controls['sobrenome'].value;
      this.form.controls['nome'].setValue(nome);
    }
    if (this.form.get('idCargo')?.value === -1 && this.form.get('novoCargo')?.valid) {
      const cargo: Cargo = { id: 0, nome: this.form.get('novoCargo')?.value };
      this.form.get('cargo')?.setValue(cargo);
    }
    if (this.form.get('idCurso')?.value === -1 && this.form.get('novoCurso')?.valid) {
      const curso: Curso = { id: 0, nome: this.form.get('novoCurso')?.value }
      this.form.get('curso')?.setValue(curso);
    }
  }

}
