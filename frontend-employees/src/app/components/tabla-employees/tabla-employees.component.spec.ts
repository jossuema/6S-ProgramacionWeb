import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEmployeesComponent } from './tabla-employees.component';

describe('TablaEmployeesComponent', () => {
  let component: TablaEmployeesComponent;
  let fixture: ComponentFixture<TablaEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaEmployeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
