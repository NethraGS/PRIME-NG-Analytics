import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetlightDialogComponent } from './streetlight-dialog.component';

describe('StreetlightDialogComponent', () => {
  let component: StreetlightDialogComponent;
  let fixture: ComponentFixture<StreetlightDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreetlightDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StreetlightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
