// Function to extract the video ID from a YouTube URL
function getYouTubeVideoId ( url ) {
    const match = url.match( /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=))([^&\n?#]+)/ );
    return ( match && match[ 1 ] ) || null;
}

// Function to generate the iframe code
function generateYouTubeIframe ( videoUrl ) {
    const videoId = getYouTubeVideoId( videoUrl );
    if ( videoId ) {
        const iframeCode = `https://www.youtube.com/embed/${ videoId }`;
        return iframeCode;
    }
}

module.exports = {
    convertVideo: generateYouTubeIframe
}