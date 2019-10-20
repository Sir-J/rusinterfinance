import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, takeWhile } from 'rxjs/operators';
import { TicketDto } from 'src/app/models';
import { GeoDbService } from 'wft-geodb-angular-client';
import { GeoResponse } from 'wft-geodb-angular-client/lib/model/geo-response.model';
import { PlaceSummary } from 'wft-geodb-angular-client/lib/model/place-summary.model';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-add-ticket',
    templateUrl: './add-ticket.component.html',
    styleUrls: ['./add-ticket.component.less']
})
export class AddTicketComponent implements OnInit, OnDestroy {
    departures: Array<PlaceSummary>;
    arrivals: Array<PlaceSummary>;

    ticketForm: FormGroup;

    @Output()
    readonly addTicket: EventEmitter<TicketDto> = new EventEmitter<TicketDto>();
    private ticket = new TicketDto();
    private departureTimeZone;
    private arrivalTimeZone;
    private ngUnsubscribe = new Subject<void>();

    constructor(private service: GeoDbService) {}

    ngOnInit() {
        this.ticketForm = new FormGroup({
            departure: new FormControl('', [Validators.required]),
            departureDateTime: new FormControl({ value: '', disabled: true }, [Validators.required]),
            arrival: new FormControl('', [Validators.required]),
            arrivalDateTime: new FormControl({ value: '', disabled: true }, [Validators.required])
        });

        this.ticketForm
            .get('departure')
            .valueChanges.pipe(
                takeUntil(this.ngUnsubscribe),
                debounceTime(500)
            )
            .subscribe((val: string | PlaceSummary) => {
                if (typeof val === 'string' && val.length >= 3) {
                    this.ticketForm.get('departureDateTime').disable();
                    this.service
                        .findPlaces({
                            namePrefix: val,
                            offset: 0,
                            limit: 10
                        })
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe((result: GeoResponse<PlaceSummary[]>) => {
                            this.departures = result.data;
                        });
                }
                if (typeof val === 'object' && !isNullOrUndefined(val)) {
                    this.ticketForm.get('departureDateTime').enable();
                    this.ticket.departure = val;
                    this.departures = [];
                }
            });

        this.ticketForm
            .get('arrival')
            .valueChanges.pipe(
                takeUntil(this.ngUnsubscribe),
                debounceTime(500)
            )
            .subscribe((val: string | PlaceSummary) => {
                if (typeof val === 'string' && val.length >= 3) {
                    this.ticketForm.get('arrivalDateTime').disable();
                    this.service
                        .findPlaces({
                            namePrefix: val,
                            offset: 0,
                            limit: 10
                        })
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe((result: GeoResponse<PlaceSummary[]>) => {
                            this.arrivals = result.data;
                        });
                }
                if (typeof val === 'object' && !isNullOrUndefined(val)) {
                    this.ticketForm.get('arrivalDateTime').enable();
                    this.ticket.arrival = val;
                    this.arrivals = [];
                }
            });

        this.ticketForm
            .get('arrivalDateTime')
            .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(val => (this.ticket.arrivalDatetime = val));

        this.ticketForm
            .get('departureDateTime')
            .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(val => (this.ticket.departureDatetime = val));
    }

    selectedDeparture($event: MatAutocompleteSelectedEvent) {
        this.service
            .getPlaceDateTime(($event.option.value as PlaceSummary).id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(date => {
                this.departureTimeZone = moment(date.data)['_tzm'];
                this.ticket.departureDatetime = moment(date.data, 'YYYY-MM-DDTHH:mm:ss').toDate();
                this.ticketForm.get('departureDateTime').setValue(this.ticket.departureDatetime);
            });
    }

    selectedArrival($event: MatAutocompleteSelectedEvent) {
        this.service
            .getPlaceDateTime(($event.option.value as PlaceSummary).id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(date => {
                this.arrivalTimeZone = moment(date.data)['_tzm'];
                this.ticket.arrivalDatetime = moment(date.data, 'YYYY-MM-DDTHH:mm:ss').toDate();
                this.ticketForm.get('arrivalDateTime').setValue(this.ticket.arrivalDatetime);
            });
    }

    displayFn(city?: PlaceSummary): string | undefined {
        return city ? `${city.city}(${city.country})` : undefined;
    }

    getMinArrivalDateTime() {
        if (this.ticket.departureDatetime && this.ticket.arrivalDatetime) {
            return moment(this.ticket.departureDatetime)
                .add(this.departureTimeZone > 0 ? -this.departureTimeZone : Math.abs(this.departureTimeZone), 'm')
                .add(this.arrivalTimeZone + 1, 'm')
                .toDate();
        }
    }

    getMaxDepartureDateTime() {
        if (this.ticket.departureDatetime && this.ticket.arrivalDatetime) {
            return moment(this.ticket.arrivalDatetime)
                .add(this.arrivalTimeZone > 0 ? -this.arrivalTimeZone : Math.abs(this.arrivalTimeZone), 'm')
                .add(this.departureTimeZone - 1, 'm')
                .toDate();
        }
    }

    add() {
        this.addTicket.emit(this.ticket);
        this.ticketForm.reset();
        this.ticket = new TicketDto();
        this.arrivalTimeZone = undefined;
        this.departureTimeZone = undefined;
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
