const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )

async function getPosters () {
    const data = await sheet.getSheetData( {
        sheetID: '1l-qpenWwRYeFSVCH38NZtpZTwLfb4545pXCdFGmqD2w',
        sheetName: 'Posters',
        query: 'SELECT *',
        callback: getBookData
    } )
    return data
}

function getBookData ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let PosterUrl = imgLink.getImgUrl( value.Poster_Img )
        let info = {
            SrNo: value.Sr_No,
            Poster_Name: value.Poster_Name,
            PosterImg: PosterUrl,
            ViewPoster: value.Poster_Img
        }
        infoCollection.push( info )
    } )
    return infoCollection
}


module.exports = {
    getPosters: getPosters
}