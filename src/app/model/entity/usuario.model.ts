import { AbstractEntity } from "src/app/core/crud/model/abstract-model.model";
import { Cargo } from "./cargo.model";
import { Curso } from "./curso.model";

export class Usuario extends AbstractEntity {
    nome: string = "";
    login: string = "";
    senha: string = "";
    email: string = "";
}

export class Aluno extends Usuario {
    idCargo: number = 0;
    cargo: Cargo = new Cargo();
    telefone: string = "";
    celular: string = "";
    idCurso: number = 0;
    curso: Curso = new Curso();
    anoIngresso: Date = new Date();
    anoFormatura: Date = new Date();
    listaVagasCandidatadas: any;
}

