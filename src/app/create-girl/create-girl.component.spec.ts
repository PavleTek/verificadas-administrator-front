import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGirlComponent } from './create-girl.component';

describe('CreateGirlComponent', () => {
  let component: CreateGirlComponent;
  let fixture: ComponentFixture<CreateGirlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGirlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateGirlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
