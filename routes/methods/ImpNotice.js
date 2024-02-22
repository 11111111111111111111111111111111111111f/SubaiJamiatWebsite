const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )

async function getImage () {
    const data = await sheet.getSheetData( {
        sheetID: '1zTF--OEwDOlqa8GKyFtpnjqiV-mJLHR1qb2cwYpRm-k',
        sheetName: 'Importance Notice ( اہم اعلان )',
        query: 'SELECT *',
        callback: getNoticeImg
    } )
    return data
}

function getNoticeImg ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let image = imgLink.getImgUrl( value.Image )
        let info = {
            image: image
        }
        infoCollection.push( info )
    } )
    return infoCollection
}

module.exports = {
    getNoticeImg: getImage
}