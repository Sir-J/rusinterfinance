import { async, TestBed } from '@angular/core/testing';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AddTicketComponent } from 'src/app/components/add-ticket/add-ticket.component';
import { GoogleMapComponent } from 'src/app/components/google-map/google-map.component';
import { MaterialModule } from 'src/app/modules';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GeoDbFreeModule } from 'wft-geodb-angular-client';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MaterialModule,
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                ReactiveFormsModule,
                GeoDbFreeModule.forRoot({
                    apiKey: null,
                    serviceUri: 'http://geodb-free-service.wirefreethought.com'
                })
            ],
            declarations: [AppComponent, AddTicketComponent, GoogleMapComponent]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'rusinterfinance'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('rusinterfinance');
    });

    // it('should render title', () => {
    //     const fixture = TestBed.createComponent(AppComponent);
    //     fixture.detectChanges();
    //     const compiled = fixture.debugElement.nativeElement;
    //     expect(compiled.querySelector('mat-toolbar span:not(.mat-spacer)').textContent).toContain('rusinterfinance');
    // });
});
