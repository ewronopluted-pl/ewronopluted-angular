import { Timestamp as string } from 'rxjs';

export class InfoModel {
    public id: number;
    public date: Date;
    public user?: string;
    public month?: number;
    public message?: string;
    public amount?: number;
    public type?: string;
    public channel?: string;
    public userAccepted?: number;
    public moderatorAccepted?: number;
    public uptime?: number;
}    
