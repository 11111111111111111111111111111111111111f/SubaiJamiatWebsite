const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )

async function getJumaList () {
    const data = await sheet.getSheetData( {
        sheetID: '1y_2Bg0pil4081-zvmV4rf4bj83oOFA1uiI9gzmAR4uE',
        sheetName: 'khutba-e-juma',
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
            Date: value.Date,
            Year: value.Year,
            Month: value.Month,
            ImgUrl: ImgUrl,
            ViewImg: value.ImgUrl
        }
        infoCollection.push( info )
    } )
    return infoCollection
}

module.exports = {
    getJumaList: getJumaList
}