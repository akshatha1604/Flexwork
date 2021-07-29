using {app.schema_flexwork as me} from '../db/schema';

service AdminService {
 entity SAPOfficeData as projection on me.SAPOfficeData;
 entity Teams as projection on me.Teams;
 entity TeamSeatMapping as projection on me.TeamSeatMapping
 actions {
        @sap.applicable.path: 'addSeats'
        action addSeat();
        @sap.applicable.path: 'removeSeats'
        action removeSeat();
        
        }
}
