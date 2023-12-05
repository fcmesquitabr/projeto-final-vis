import { TestBed } from '@angular/core/testing';

import { UfSegmentoService } from './uf-segmento.service';

describe('UfSegmentoService', () => {
  let service: UfSegmentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UfSegmentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
