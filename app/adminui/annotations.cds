using AdminService as service from '../../srv/service';


annotate service.SAPOfficeData // header-level annotations
{
    locationID   @title : 'Location ID';
    country_code @title : 'Country';
    city         @title : 'City';
    office       @title : 'Office';
    office_ID    @title : 'Office';
    block        @title : 'Block';
    floor        @title : 'Floor';
    totalSeat    @title : 'Total Seat';
}

annotate service.SAPOfficeData with @( // header-level annotations

    UI.HeaderInfo      : {
        TypeName       : 'Location',
        TypeNamePlural : 'Locations',
        Title          : {Value : locationID}
    },

    UI.SelectionFields : [
        country_code,
        city_ID,
        office_ID,
        block,
        floor
    ],
    UI.LineItem        : [
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.acceptTravel',   Label  : '{i18n>AcceptTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.rejectTravel',   Label  : '{i18n>RejectTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.deductDiscount', Label  : '{i18n>DeductDiscount}' },
        {Value : locationID},
        {Value : country_code},
        {Value : city_ID},
        {Value : office_ID},
        {Value : block},
        {Value : floor},
        {Value : totalSeat}
    ],


    UI.Identification  : [
        {
            $Type             : 'UI.DataField',
            Value             : locationID,
            ![@UI.Importance] : #High
        },
        {
            $Type : 'UI.DataField',
            Value : country_code
        },
        {
            $Type             : 'UI.DataField',
            Value             : city_ID,
            ![@UI.Importance] : #High,
            Label             : 'City'
        },
        {
            $Type             : 'UI.DataField',
            Value             : office_ID,
            ![@UI.Importance] : #High,
            Label             : 'Office'
        },
        {
            $Type             : 'UI.DataField',
            Value             : block,
            ![@UI.Importance] : #High

        },
        {
            $Type             : 'UI.DataField',
            Value             : floor,
            ![@UI.Importance] : #High
        },
        {
            $Type             : 'UI.DataField',
            Value             : totalSeat,
            ![@UI.Importance] : #High,

        }
    ],

    UI.Facets          : [
        //First facet for self..
        {
            $Type  : 'UI.CollectionFacet',
            Label  : 'Location',
            ID     : 'Location',
            Facets : [{
                $Type  : 'UI.ReferenceFacet',
                Target : '@UI.Identification',
                Label  : 'Location'
            }]
        },
        // 2nd facet for teams.
        {
            $Type  : 'UI.ReferenceFacet',
            Target : 'Teams/@UI.LineItem',
            Label  : 'Teams'
        }
    ]
);


annotate service.Teams // header-level annotations
{
    teamID         @title : 'Team ID';
    teamName       @title : 'Team Name';
    manager        @title : 'Manager Name';
    employeeCount  @title : 'Team Count';
    maxSeatPercent @title : 'Max Seat Percent';
}

annotate service.Teams with @( // header-level annotations

    UI.HeaderInfo      : {
        TypeName       : 'Team Detail',
        TypeNamePlural : 'Team Details',
        Title          : {Value : teamID}
    },

    UI.SelectionFields : [
        teamID,
        teamName,
        manager_ID,
        employeeCount,
        maxSeatPercent
    ],
    UI.LineItem        : [
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.acceptTravel',   Label  : '{i18n>AcceptTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.rejectTravel',   Label  : '{i18n>RejectTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.deductDiscount', Label  : '{i18n>DeductDiscount}' },
        {Value : teamID},
        {Value : teamName},
        {Value : manager_ID},
        {Value : employeeCount},
        {Value : maxSeatPercent}
    ],


    UI.Identification  : [
        {
            $Type             : 'UI.DataField',
            Value             : teamID,
            ![@UI.Importance] : #High
        },
        {
            $Type : 'UI.DataField',
            Value : teamName
        },
        {
            $Type             : 'UI.DataField',
            Value             : manager_ID,
            ![@UI.Importance] : #High,
            Label             : 'City'
        },
        {
            $Type             : 'UI.DataField',
            Value             : employeeCount,
            ![@UI.Importance] : #High,
            Label             : 'Office'
        },
        {
            $Type             : 'UI.DataField',
            Value             : maxSeatPercent,
            ![@UI.Importance] : #High

        }
    ],

    UI.Facets          : [
                          //First facet for self..
                         {
        $Type  : 'UI.CollectionFacet',
        Label  : 'Team Details',
        ID     : 'Teams',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Target : '@UI.Identification',
            Label  : 'Team Details'
        }]
    }]
);
