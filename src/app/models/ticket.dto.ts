import { PlaceSummary } from 'wft-geodb-angular-client/lib/model/place-summary.model';

export class TicketDto {
    /**
     * Место вылета
     */
    departure: PlaceSummary;
    departureDatetime: Date;
    /**
     * Место прибытия
     */
    arrival: PlaceSummary;
    arrivalDatetime: Date;
}
