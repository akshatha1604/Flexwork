using {app.schema_flexwork as me} from '../db/schema';
using AdminService as service from './service';

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
        Text            : country.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };

    city     @Common : {
        Text            : city.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };

    office   @Common : {
        Text            : office.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };

    building @Common : {
        Text            : building.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };
};
