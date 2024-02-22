function convertToEmbed ( url ) {

    // Check if the input is a valid YouTube playlist share link
    const regex = /youtube\.com\/playlist\?list=([\w-]+)/;
    const match = url.match( regex );

    if ( match ) {
        const playlistId = match[ 1 ];
        const embedCode = `https://www.youtube.com/embed/videoseries?list=${ playlistId }`;
        return embedCode
    }
}

module.exports = {
    youtubeLink: convertToEmbed
}