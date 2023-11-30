import { Component, Input, OnInit } from '@angular/core';
import { TokenService } from 'src/app/infra/token/token.service';
import { Empresa } from 'src/app/model/entity/empresa.model';
import { VagaFilterDTO, VagaResponseDTO } from 'src/app/model/entity/vaga.model';
import { vagaService } from 'src/app/service/vaga.service';

@Component({
  selector: 'app-vagas-empresa',
  templateUrl: './vagas-empresa.component.html',
  styleUrls: ['./vagas-empresa.component.scss']
})
export class VagasEmpresaComponent implements OnInit {

  @Input() empresa: Empresa = new Empresa;
  vagas: VagaResponseDTO[] = [];

  constructor(
    private readonly vagaService: vagaService,
    private readonly tokenService: TokenService
  ) {

  }

  ngOnInit(): void {
    this.pesquisar();
  }

  pesquisar() {
    const idEmpresa = this.empresa.id;
    const filter: VagaFilterDTO = new VagaFilterDTO();
    filter.idEmpresa = idEmpresa;
    this.vagaService.buscarByUser(filter).subscribe(response => {
      this.vagas = response;

    })
  }

}
