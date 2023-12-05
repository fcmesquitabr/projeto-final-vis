import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaoGeralComponent } from './visao-geral.component';

describe('VisaoGeralComponent', () => {
  let component: VisaoGeralComponent;
  let fixture: ComponentFixture<VisaoGeralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisaoGeralComponent]
    });
    fixture = TestBed.createComponent(VisaoGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
