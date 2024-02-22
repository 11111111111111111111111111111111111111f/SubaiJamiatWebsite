const sheet = require( './book-sheet' )

async function getTausiaData () {
    const data = await sheet.getSheetData( {
        sheetID: '1ssAs5g4-okypOlCi3WYUlKJcv6NIQhS5_rNJyjBnHrU',
        sheetName: 'tausia',
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
    getTausiaData: getTausiaData
}