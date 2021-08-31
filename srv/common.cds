using {app.schema_flexwork as me} from '../db/schema';
using { User, sap } from '@sap/cds/common';
using AdminService as service from './service';

// aspect managed {
//   createdAt     : Timestamp @cds.on.insert : $now;
//   createdBy     : User      @cds.on.insert : $user;
//   LastChangedAt : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
//   LastChangedBy : User      @cds.on.insert : $user @cds.on.update : $user;
// }

annotate service.Teams with {
    manager     @Common : {
        Text            : manager.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };

    headManager @Common : {
        Text            : headManager.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };
        
};

annotate service.SAPOfficeData with {
    admin    @Common : {
        Text            : admin.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };

    country  @Common : {
        Text            : country.descr,
        TextArrangement : #TextOnly
    //  ValueListWithFixedValues
    };

    city     @Common : {
        Text            : city.name,
        TextArrangement : #TextOnly
    //  ValueListWithFixedValues
    };

    office   @Common : {
        Text            : office.name,
        TextArrangement : #TextOnly
    //  ValueListWithFixedValues
    };

    building @Common : {
        Text            : building.name,
        TextArrangement : #TextOnly
    //  ValueListWithFixedValues
    };
};
