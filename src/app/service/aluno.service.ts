import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AbstractComponentService } from "../core/crud/service/abstract-component-service.service";
import { Aluno } from "../model/entity/usuario.model";

@Injectable({
    providedIn: 'root'
})
export class AlunoService extends AbstractComponentService<Aluno> {

    constructor(private _http: HttpClient) {
        super(_http, 'aluno');
    }

}