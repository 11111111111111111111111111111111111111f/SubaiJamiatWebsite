const sheet = require( './book-sheet' )

async function getDate () {

    const data = await sheet.getSheetData( {
        sheetID: '1ASNq__DEyxWze5rr5sJE4EqRGQTUSox0LkAuZInz3fg',
        sheetName: 'Moon Date',
        query: 'SELECT *',
        callback: getDateData
    } )

    let date = new Date().getDate()

    let todayArFunction = () => {
        for ( i = 0; i < data.length; i++ ) {
            if ( data[ i ].EnDate == date ) {
                return data[ i ]
            }
        }
    }

    let todayArDate = todayArFunction()

    return todayArDate

}

function getDateData ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let info = {
            EnDate: value.English_Date,
            Date: value.Date + ' ' + value.Month + ' ' + value.Year,
            DateForMoonIcon: value.Date
        }
        infoCollection.push( info )
    } )
    return infoCollection
}


module.exports = {
    getDate: getDate
}