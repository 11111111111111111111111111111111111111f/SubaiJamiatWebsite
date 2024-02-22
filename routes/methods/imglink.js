function getImgUrl ( url ) {
    const splittedUrl = url.split( "/" );
    // Find the index of "d" in the URL
    const indexOfD = splittedUrl.indexOf( "d" );
    // Extract the file ID from the URL
    const fileId = splittedUrl[ indexOfD + 1 ];
    // const imgUrl = `https://drive.google.com/uc?export=download&id=${ fileId }` //it is not working
    // const imgUrl = `https://drive.google.com/uc?id=${ fileId }` //it is also not working (both are working in browser but not working in html image src)
    const imgUrl = `https://lh3.googleusercontent.com/u/0/d/${ fileId }`
    return imgUrl
}

module.exports = {
    getImgUrl: getImgUrl
}