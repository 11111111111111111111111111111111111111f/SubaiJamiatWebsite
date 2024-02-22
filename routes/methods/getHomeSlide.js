const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )

async function getSlides () {
    const data = await sheet.getSheetData( {
        sheetID: '1s7NmbBRcLXfquuleHAhwsYhX8WADeas1dGnO5tAeYN0',
        sheetName: 'home slide',
        query: 'SELECT *',
        callback: getSlideData
    } )
    return data
}

function getSlideData ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let bookUrl = imgLink.getImgUrl( value.Img_Url )
        let info = {
            SrNo: value.Sr_No,
            SlideName: value.Name,
            SlideImg: bookUrl
        }
        infoCollection.push( info )
    } )
    return infoCollection
}

module.exports = {
    getSlides: getSlides
}
