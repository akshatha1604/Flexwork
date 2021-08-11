using {app.schema_flexwork as me} from '../db/schema';

service AdminService {


    @Capabilities : {
        Insertable : true,
        Updatable  : true,
        Deletable  : true
    }
    entity SAPOfficeData   as projection on me.SAPOfficeData;

    @Capabilities : {
        Insertable : true,
        Updatable  : true,
        Deletable  : true
    }
    entity Teams           as projection on me.Teams;

    entity TeamSeatMapping as projection on me.TeamSeatMapping actions {
        @sap.applicable.path : 'removeSeats'
        action removeSeat();
    }

    @sap.applicable.path : 'addSeats'
    action addSeat();

}
