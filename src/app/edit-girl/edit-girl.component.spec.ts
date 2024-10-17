import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGirlComponent } from './edit-girl.component';

describe('EditGirlComponent', () => {
  let component: EditGirlComponent;
  let fixture: ComponentFixture<EditGirlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGirlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditGirlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
