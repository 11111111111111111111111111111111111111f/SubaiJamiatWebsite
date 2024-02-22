const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )

async function getMasajid () {
    const data = await sheet.getSheetData( {
        sheetID: '1GJfACildObCdNzQX8_tA4dtlg_pKr7dCRSmYzpX-P9o',
        sheetName: 'Masajid',
        query: 'SELECT *',
        callback: getMasajidData
    } )
    return data
}

function getMasajidData ( data ) {
    let infoCollection = []
    let places = new Set()

    data.forEach( value => {
        places.add( value.Place )
    } )

    data.forEach( value => {

        let info = {
            SrNo: value.No,
            MasajidName: value.Name,
            Address: value.Address,
        }

        infoCollection.push( info )

    } )
    return { collection: infoCollection, places }
}

module.exports = {
    getMasajid: getMasajid
}