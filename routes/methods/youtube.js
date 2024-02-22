// const imgLink = require( './imglink' )
const sheet = require( './book-sheet' )
const youtubeLink = require( './convertYoutubeLink.js' )

async function getYoutube () {
    const data = await sheet.getSheetData( {
        sheetID: '1hebIXAG5tDHVkkcZVr3zvGnCrAMAw8_LtvhK-E9ODiU',
        sheetName: 'Youtube Playlist',
        query: 'SELECT *',
        callback: YoutubeList
    } )
    return data
}

function YoutubeList ( data ) {
    let infoCollection = []
    data.forEach( value => {
        let youtubeUrl = youtubeLink.youtubeLink( value.Link )
        let info = {
            SrNo: value.No,
            Name: value.Name,
            Link: youtubeUrl
        }
        infoCollection.push( info )
    } )
    return infoCollection
}

module.exports = {
    getYoutube: getYoutube
}