const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )

async function getBook () {
    const data = await sheet.getSheetData( {
        sheetID: '1nUKNho_2e4nR14KDM2ftONJ7U2dK-iMChNiymngo2PE',
        sheetName: 'New Books',
        query: 'SELECT *',
        callback: getBookData
    } )
    return data
}

function getBookData ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let bookUrl = imgLink.getImgUrl( value.Book_Img )
        let info = {
            SrNo: value.Sr_No,
            bookName: value.Book_Name,
            BookImg: bookUrl
        }
        infoCollection.push( info )
    } )
    return infoCollection
}


module.exports = {
    getBook: getBook
}