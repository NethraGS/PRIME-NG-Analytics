import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimmingSchedulesComponent } from './dimming-schedules.component';

describe('DimmingSchedulesComponent', () => {
  let component: DimmingSchedulesComponent;
  let fixture: ComponentFixture<DimmingSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimmingSchedulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DimmingSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
