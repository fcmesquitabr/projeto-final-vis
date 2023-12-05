import { TestBed } from '@angular/core/testing';

import { MunicipioSegmentoService } from './municipio-segmento.service';

describe('MunicipioSegmentoService', () => {
  let service: MunicipioSegmentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MunicipioSegmentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
