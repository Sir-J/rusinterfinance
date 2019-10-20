import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MaterialModule } from 'src/app/modules';
import { GeoDbFreeModule } from 'wft-geodb-angular-client';

import { AddTicketComponent, AppComponent, GoogleMapComponent } from './components';

@NgModule({
    declarations: [AppComponent, AddTicketComponent, GoogleMapComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        GeoDbFreeModule.forRoot({
            apiKey: null,
            serviceUri: 'http://geodb-free-service.wirefreethought.com'
        })
    ],
    providers: [{ provide: OWL_DATE_TIME_LOCALE, useValue: 'ru' }],
    bootstrap: [AppComponent]
})
export class AppModule {}
