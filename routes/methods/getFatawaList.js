const sheet = require( './book-sheet' )

async function getFatawaList () {
    const data = await sheet.getSheetData( {
        sheetID: '1ci40sBoyPY7aygfEPu_O48wOX1gOWw2fsRucj4_jbEI',
        sheetName: 'Fatawa Search List',
        query: 'SELECT *',
        callback: getFatawa
    } )
    return data
}

function getFatawa ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let jawab = value.Jawab.split( "\n" )
        let info = {
            No: value.No,
            FatawaTitleNo: value.FatawaTitleNo,
            Sawal: value.Sawal,
            Jawab: jawab,
            Sail: value.Sail,
            Kutba: value.Kutba,
            Date: value.Date,
            Link: value.Link
        }
        infoCollection.push( info )
    } )
    return infoCollection
}

module.exports = {
    getFatawaList: getFatawaList
}