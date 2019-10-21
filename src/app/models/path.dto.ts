import { TicketDto } from 'src/app/models/ticket.dto';

export class PathDto {
    private static id = 1;
    id: number = undefined;
    from: string;
    to: string;
    tickets: Array<TicketDto> = new Array<TicketDto>();

    get name(): string {
        return `${this.from} - ${this.to}`;
    }

    constructor(from?: string, tickets?: Array<TicketDto>) {
        this.id = PathDto.id++;
        this.from = from;
        this.tickets = tickets ? tickets : [];
    }
}
