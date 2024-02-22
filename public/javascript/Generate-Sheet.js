const GenerateBtn = document.querySelector( '.Generate-sheet' )
// const body = document.querySelector( 'body' )
const GenerateAllBtn = document.querySelector( '.Generate-All-Data-Sheet' )

GenerateBtn.onclick = async () => {

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbx-dBd5kQ3jrdfQ8TDi4h_Ht2NjMOgfFjemvsDFcp-t9TNso1dEQs9TlH7qLL9wJP2icA/exec'

    body.style.cursor = 'wait'

    let request = await fetch( '/RegisterationData', { method: 'get' } )
    let RegisterationData = await request.json()

    let count = 0;

    RegisterationData.forEach( ( value, index ) => {

        let data = {

            rollno: value.rollno,
            name: value.name,
            mobile_number: value.number,
            masjid_name_address: value.masjid_name_address,
            qualification: value.qualification,
            masjid_president: value.masjid_president,
            masjid_seceratory: value.masjid_seceratory,
            coming_reason: value.coming_reason,
            image: 'https://www.ahelhadeesmumbai.com/RegisterationFiles/Images/' + value.image,
            document: 'https://www.ahlehadeesmumbai.com/RegisterationFiles/Files/' + value.pdf,
            status: value.status

        }

        let formData = new FormData()

        for ( let key in data ) {
            formData.append( `${ key }`, data[ key ] )
        }


        fetch( scriptUrl, {
            method: 'post',
            body: formData,
        } ).then( response => response.json() )
            .then( response => {
                count++
                if ( count == RegisterationData.length ) {
                    body.style.cursor = 'auto'
                    window.open( 'https://docs.google.com/spreadsheets/d/1cyUUr3XPBWcVmesX0TcxqkLj59LO-NzCVYT9jeV7pxg/edit#gid=0' )
                }
            } ).catch( err => {
                console.log( 'error occured  : ', err )
                // location.href = '/error'
            } )
    } )
}

GenerateAllBtn.onclick = async () => {

    let scriptUrl = 'https://script.google.com/macros/s/AKfycbwOOmV3WKYaa80heGuxqQgn-a86rnp0Entr-RpTY04boFnhvZ3sdtFx0p4b1Wou0evj/exec'

    body.style.cursor = 'wait'

    let request = await fetch( '/RegisterationAllData', { method: 'get' } )
    let RegisterationData = await request.json()

    let count = 0;

    RegisterationData.forEach( ( value, index ) => {

        let data = {

            rollno: value.rollno,
            name: value.name,
            mobile_number: value.number,
            masjid_name_address: value.masjid_name_address,
            qualification: value.qualification,
            masjid_president: value.masjid_president,
            masjid_seceratory: value.masjid_seceratory,
            coming_reason: value.coming_reason,
            image: 'https://www.ahelhadeesmumbai.com/RegisterationFiles/Images/' + value.image,
            document: 'https://www.ahlehadeesmumbai.com/RegisterationFiles/Files/' + value.pdf,
            status: value.status

        }

        let formData = new FormData()

        for ( let key in data ) {
            formData.append( `${ key }`, data[ key ] )
        }


        fetch( scriptUrl, {
            method: 'post',
            body: formData,
        } ).then( response => response.json() )
            .then( response => {
                count++
                if ( count == RegisterationData.length ) {
                    body.style.cursor = 'auto'
                    window.open( 'https://docs.google.com/spreadsheets/d/1RlZP_1EMiRx20P7jrUnf-XwZWYVvOYaMrRiqU7_wWBk/edit#gid=0' )
                }
            } ).catch( err => {
                console.log( 'error occured  : ', err )
                // location.href = '/error'
            } )
    } )
}