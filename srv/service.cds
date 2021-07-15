using {app.schema_flexwork as me} from '../db/schema';

service AdminService {
 @readonly entity SAPOfficeData as projection on me.SAPOfficeData;
 entity Teams as projection on me.Teams;
 entity TeamSeatMapping as projection on me.TeamSeatMapping;
}
