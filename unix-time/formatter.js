const timeConverter = function ( UNIX_timestamp ) {
    let a = new Date( UNIX_timestamp * 1000 );
    let months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    let year = a.getFullYear();
    let month = months[ a.getMonth() ];
    let date = a.getDate();
    let hour = a.getHours();
    let curr = ( hour > 12 ) ? 'PM' : 'AM'
    hour = ( hour > 12 ) ? hour - 12 : hour
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec + ' ' + curr;
    return time;
}

module.exports = { timeConverter: timeConverter }