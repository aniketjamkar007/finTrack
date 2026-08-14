import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title set to "finTrack"', () => {
    expect(component.title).toBe('finTrack');
  });

  it('should render the shell container', () => {
    const compiled = fixture.nativeElement.querySelector('.shell');
    expect(compiled).toBeTruthy();
  });

  it('should render the topbar header', () => {
    const header = fixture.nativeElement.querySelector('.topbar');
    expect(header).toBeTruthy();
  });

  it('should display the brand name "finTrack"', () => {
    const brandName = fixture.nativeElement.querySelector('.brand-name');
    expect(brandName.textContent).toContain('finTrack');
  });

  it('should render navigation menu', () => {
    const nav = fixture.nativeElement.querySelector('.nav');
    expect(nav).toBeTruthy();
  });

  it('should have three router links in navigation', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav a');
    expect(links.length).toBe(3);
  });

  it('should have Dashboard link pointing to root', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav a');
    expect(links[0].getAttribute('routerLink')).toBe('/');
    expect(links[0].textContent).toContain('Dashboard');
  });

  it('should have Add Transaction link', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav a');
    expect(links[1].getAttribute('routerLink')).toBe('/transaction');
    expect(links[1].textContent).toContain('Add Transaction');
  });

  it('should have Transactions link', () => {
    const links = fixture.nativeElement.querySelectorAll('.nav a');
    expect(links[2].getAttribute('routerLink')).toBe('/transactions');
    expect(links[2].textContent).toContain('Transactions');
  });

  it('should render the main content area', () => {
    const main = fixture.nativeElement.querySelector('.content');
    expect(main).toBeTruthy();
  });

  it('should have router-outlet for routing', () => {
    const routerOutlet = fixture.debugElement.query((el) =>
      el.name === 'router-outlet'
    );
    expect(routerOutlet).toBeTruthy();
  });
});
