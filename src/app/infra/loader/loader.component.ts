import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'taugs-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  service: LoaderService;

  constructor(private _service: LoaderService) {
    this.service = _service;
  }

  ngOnInit(): void {
  }

}
