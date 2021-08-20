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

annotate service.SAPOfficeData with @odata.draft.enabled;

annotate service.SAPOfficeData with @( // header-level annotations

    Capabilities       : {

        InsertRestrictions.Insertable : false,
        UpdateRestrictions.Updatable  : true,
        DeleteRestrictions.Deletable  : false,
    },


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
            Target : 'Teams/@UI.LineItem', //'Teams/@UI.LineItem',
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
    seatAssigned   @title : 'Seats Assigned';
    seatUnassigned @title : 'Seat Unassigned';
    locationID     @title : 'Location ID';

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
        // {
        //     $Type  : 'UI.DataFieldForAction',
        //     Action : 'AdminService.addTeam',
        //     Label  : 'Add Team',
        // },
        // {
        //     $Type  : 'UI.DataFieldForAction',
        //     Action : 'AdminService.removeTeam',
        //     Label  : 'Remove Team',
        // },

        {Value : teamID},
        {Value : teamName},
        {Value : manager_ID},
        {Value : employeeCount},
        {Value : maxSeatPercent},
        {Value : seatAssigned},
        {Value : seatUnassigned}
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
        },
        // 2nd facet for seat details.
        {
            $Type  : 'UI.ReferenceFacet',
            Target : 'to_Seats/@UI.LineItem',
            Label  : 'Seat Detail'
        }
    ]
);


annotate service.TeamSeatMapping 
   {
    seatID   @title : 'Seat ID';
   };

//annotate service.TeamSeatMapping with @odata.draft.enabled;
annotate service.TeamSeatMapping with
@( // header-level annotations

    Capabilities : {
        InsertRestrictions.Insertable : false,
        UpdateRestrictions.Updatable  : true,
        DeleteRestrictions.Deletable  : true,
    },

    UI.HeaderInfo      : {
        TypeName       : 'Team Seat Detail',
        TypeNamePlural : 'Team Seat Details',
        Title          : {Value : teamID}
    },

    UI.SelectionFields : [
        seatID,
        locationID,
        teamID,
        monitorCount,
        facility1,
        facility2,
        facility3
    ],

    UI.LineItem        : [ {Value : seatID} ],

// UI.Identification  : [
//     {
//         $Type             : 'UI.DataField',
//         Value             : seatID,
//         ![@UI.Importance] : #High
//     },
//     {
//         $Type             : 'UI.DataField',
//         Value             : monitorCount,
//         ![@UI.Importance] : #High,
//         Label             : 'No.Of Monitors'
//     },
//     {
//         $Type             : 'UI.DataField',
//         Value             : facility1,
//         ![@UI.Importance] : #High,
//         Label             : ' Phone Extension'
//     },
//     {
//         $Type             : 'UI.DataField',
//         Value             : facility2,
//         ![@UI.Importance] : #High,
//         Label             : 'Laptop Lock'
//     },
// ],
);
