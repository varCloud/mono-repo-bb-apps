import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportCreator } from './support-creator';

describe('SupportCreator', () => {
  let component: SupportCreator;
  let fixture: ComponentFixture<SupportCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportCreator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
