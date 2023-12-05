import { TestBed } from '@angular/core/testing';

import { NotaDiaService } from './nota-dia.service';

describe('NotaDiaService', () => {
  let service: NotaDiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotaDiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
