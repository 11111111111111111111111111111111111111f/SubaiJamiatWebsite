const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )

async function getMagazine () {
    const data = await sheet.getSheetData( {
        sheetID: '1wKHKU1SABVr-U3yPf-eiSJnz6D6UiEagu6ZRsIqBbp8',
        sheetName: 'New Magazines',
        query: 'SELECT *',
        callback: getBookData
    } )
    return data
}

function getBookData ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let magazineUrl = imgLink.getImgUrl( value.Magazine_Img )
        let info = {
            SrNo: value.Sr_No,
            magazineName: value.Magazine_Name,
            magazineImg: magazineUrl
        }
        infoCollection.push( info )
    } )
    return infoCollection
}


module.exports = {
    getMagazine: getMagazine
}