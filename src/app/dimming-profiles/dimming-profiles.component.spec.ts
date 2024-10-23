import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimmingProfilesComponent } from './dimming-profiles.component';

describe('DimmingProfilesComponent', () => {
  let component: DimmingProfilesComponent;
  let fixture: ComponentFixture<DimmingProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimmingProfilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DimmingProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
