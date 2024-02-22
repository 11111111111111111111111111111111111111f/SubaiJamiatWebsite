const updateBtns = document.querySelectorAll( '.update-btn' )
const statusInput = document.querySelectorAll( '.status-input' )
const downloadPdfBtns = document.querySelectorAll( '.download-pdf-btn' )

updateBtns.forEach( btn => {
    btn.addEventListener( 'click', updateStatus )
} )

downloadPdfBtns.forEach( btn => {
    btn.addEventListener( 'click', GeneratePdf )
} )

function updateStatus () {

    let id = this.getAttribute( 'data-id' )
    console.log( id )
    let updatedStatus;
    statusInput.forEach( status => {
        if ( status.getAttribute( 'data-id' ) == id ) {

            updatedStatus = status.value

        }
    } )

    fetch( `/update-tausia-status/${ id }`, {
        method: 'put',
        body: JSON.stringify( { status: updatedStatus } ),
        headers: {
            'content-type': 'application/json'
        }
    } ).then( response => response.json() )
        .then( response => {
            if ( response.status == 'success' ) {
                location.reload()
            } else {
                location.href = '/error'
            }
        } ).catch( error => {
            console.log( error )
            location.href = '/error'
        } )


}

function GeneratePdf () {

    document.body.style.cursor = 'wait'

    let id = this.getAttribute( 'data-id' )

    fetch( '/generate-tausia-pdf', {
        method: 'post',
        body: JSON.stringify( { id: id } ),
        headers: {
            'content-type': 'application/json'
        }
    } ).then( response => response.json() )
        .then( response => {
            if ( response.status == 'success' ) {

                document.body.style.cursor = 'auto'
                window.open( `https://ahlehadeesmumbai.com/TausiaApproved/${ response.pdf }` )

            }
        } ).catch( error => {
            // console.log( error )
            location.href = '/error'
        } )


}