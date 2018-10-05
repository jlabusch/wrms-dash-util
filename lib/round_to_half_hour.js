// Input:  3.0  3.24  3.25  3.5  3.74  3.75   4.0
// Output: 3.0  3.0   3.5   3.5  3.5   4.0    4.0
//
// But the minimum amount is 0.5.
module.exports = function(h){
    let i = h|0;
    h-=i;
    if (h >= 0.75) h = 1;
    else if (h >= 0.25) h = 0.5;
    else h = 0;
    return Math.max(0.5, i+h);
}

