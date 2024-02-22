const sheet = require( './book-sheet' )
const youtubeLinks = require( './convertYVideoLink' )

async function getVideos () {
    const data = await sheet.getSheetData( {
        sheetID: '1iLK1iWABNyq-R3lmO6PJNLCdzGerb-7ECY67ioBV1-k',
        sheetName: 'Videos',
        query: 'SELECT *',
        callback: callback
    } )
    return data
}

function callback ( data ) {
    let curr_Data = data[ 0 ]
    let infoCollection = []
    if ( curr_Data.Live == '' || curr_Data.Live == undefined || curr_Data.Live.length == 0 || curr_Data.Live == null ) {
        const NewVideo = youtubeLinks.convertVideo( curr_Data.New_Video )
        const ImpVideo = youtubeLinks.convertVideo( curr_Data.Imp_Video )
        let info = {
            SrNo: curr_Data.Sr_No,
            NewVideo: NewVideo,
            ImpVideo: ImpVideo

        }
        infoCollection.push( info )
        return infoCollection
    } else {
        const NewVideo = youtubeLinks.convertVideo( curr_Data.Live )
        const ImpVideo = youtubeLinks.convertVideo( curr_Data.Imp_Video )
        let info = {
            SrNo: curr_Data.Sr_No,
            NewVideo: NewVideo,
            ImpVideo: ImpVideo

        }
        infoCollection.push( info )
        return infoCollection
    }

}

getVideos()

module.exports = {
    getVideos: getVideos
}