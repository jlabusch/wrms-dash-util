// Crunch /\s+/g into ' '
// Usage: var t = trim ` abc `;
module.exports = function(str){
    let subs = Array.prototype.slice.call(arguments, 1);

    return str.map(s => s + (subs.shift() || '')).join('').replace(/\s+/g, ' ');
}


