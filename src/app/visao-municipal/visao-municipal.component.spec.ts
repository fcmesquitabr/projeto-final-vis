import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaoMunicipalComponent } from './visao-municipal.component';

describe('VisaoMunicipalComponent', () => {
  let component: VisaoMunicipalComponent;
  let fixture: ComponentFixture<VisaoMunicipalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisaoMunicipalComponent]
    });
    fixture = TestBed.createComponent(VisaoMunicipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
