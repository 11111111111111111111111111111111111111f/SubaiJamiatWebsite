function pagination ( data, RequestedPage ) {
    let limit = 20;
    let endPage = Math.ceil( data.length / limit )
    let page = RequestedPage || 1;
    page = ( page < 1 ) ? 1 : parseInt( page )
    page = ( page > endPage ) ? endPage : parseInt( page )

    let start = ( page == 1 ) ? 1 : ( ( ( page * limit ) - limit ) + 1 )
    start = start - 1//because data is in array this is index based number

    let end = start + limit;

    end = ( end > data.length ) ? data.length : end

    start = ( start < 1 ) ? 0 : start

    return {
        start: start,
        end: end,
        endPage: endPage,
        page: page
    }
}

module.exports = {
    pagination: pagination
}