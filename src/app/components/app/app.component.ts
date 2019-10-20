import { Component } from '@angular/core';
import * as moment from 'moment';
import { PathDto, TicketDto } from 'src/app/models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    title = 'rusinterfinance';

    tickets = new Array<TicketDto>();
    routes = new Array<PathDto>();
    cities = [];
    polylines = [];
    constructor() {}

    createPath(ticket: TicketDto, path: PathDto) {
        path.tickets.push(ticket);
        path.to = ticket.arrival.city;

        const next = this.tickets.filter(
            (t: TicketDto) =>
                t.departure.city === ticket.arrival.city &&
                moment(t.departureDatetime).isAfter(moment(ticket.arrivalDatetime)) &&
                !path.tickets.map((pT: TicketDto) => pT.departure.city).includes(t.arrival.city)
        );
        if (next.length) {
            next.forEach(tick => {
                const nextPath = new PathDto();
                nextPath.from = path.from;
                nextPath.tickets = path.tickets.slice();

                this.createPath(tick, nextPath);

                this.routes.push(nextPath);
            });
        }
    }

    addTicket(ticket: TicketDto) {
        this.tickets.push(ticket);
        this.tickets = this.tickets.slice();

        this.polylines.forEach(el => el.setMap(null));
        this.polylines = [];
        this.routes = [];

        this.tickets.forEach((t: TicketDto) => {
            const path = new PathDto();
            path.from = t.departure.city;
            this.createPath(t, path);
        });
    }
}
