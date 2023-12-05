import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaoProdutoComponent } from './visao-produto.component';

describe('VisaoProdutoComponent', () => {
  let component: VisaoProdutoComponent;
  let fixture: ComponentFixture<VisaoProdutoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisaoProdutoComponent]
    });
    fixture = TestBed.createComponent(VisaoProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
