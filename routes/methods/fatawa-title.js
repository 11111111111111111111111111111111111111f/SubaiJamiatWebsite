const sheet = require( './book-sheet' )

async function getFatawaTitles () {

    const data = await sheet.getSheetData( {
        sheetID: '18cjgCpZAu_UvJ8K2MLO0Rj5prl0FVtJaztToOJErp-U',
        sheetName: 'Fatawa Title',
        query: 'SELECT *',
        callback: callback
    } )
    return data
}

function callback ( data ) {
    // let infoCollection = []
    // data.forEach( value => {
    //     let info = {
    //         SrNo: value.Sr_No,
    //         Title: value.Title,
    //         Hijri: value.Hijri,
    //         ImgUrl: ImgUrl,
    //         ViewImg: value.ImgUrl
    //     }
    //     infoCollection.push( info )
    // } )
    // return infoCollection
    return data

}

module.exports = {
    getFatawaTitles: getFatawaTitles
}