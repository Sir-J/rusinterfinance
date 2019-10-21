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
    cities = [];
    routes = [];
    private _routes = new Map();
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

        if (next.length > 0) {
            const prevTickets = [...path.tickets];
            if (path.tickets.length > 1) {
                /**
                 * Сохраняем предыдущий маршрут, как самостоятельный маршрут
                 */
                this._routes.set(path.id, path);
                path = new PathDto(path.from, [...prevTickets]);
            }
            while (next.length > 0) {
                this.createPath(next[0], path);
                this._routes.set(path.id, path);
                path = new PathDto(path.from, [...prevTickets]);
                next.shift();
            }
        }
    }

    addTicket(ticket: TicketDto) {
        this.tickets.push(ticket);
        this.tickets = [...this.tickets];

        this._routes = new Map();

        this.tickets.forEach((t: TicketDto) => {
            const path = new PathDto(t.departure.city);
            this.createPath(t, path);
        });

        this.routes = [...this._routes.values()];
    }
}
