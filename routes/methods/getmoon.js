const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )

async function getMoonData () {
    const data = await sheet.getSheetData( {
        sheetID: '11_D9PMm5CjideGOr9el-3c53285QKCE74kKcNhCCsC8',
        sheetName: 'Moon',
        query: 'SELECT *',
        callback: callback
    } )
    return data
}

function callback ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let ImgUrl = imgLink.getImgUrl( value.ImgUrl )
        let info = {
            SrNo: value.Sr_No,
            Title: value.Title,
            Hijri: value.Hijri,
            ImgUrl: ImgUrl,
            ViewImg: value.ImgUrl
        }
        infoCollection.push( info )
    } )
    return infoCollection
}

module.exports = {
    getMoonData: getMoonData
}