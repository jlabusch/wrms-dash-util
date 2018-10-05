module.exports = function(urg, imp){
    const urgs = {
        "Anytime": 0,
        "Sometime soon": 1,
        "As Soon As Possible": 2,
        "Before Specified Date": 2,
        "On Specified Date": 2,
        "After Specified Date": 2,
        "'Yesterday'": 3
    };
    let urg_n = urgs[urg];

    const imps  = [
        "Minor importance",
        "Average importance",
        "Major importance",
        "Critical!"
    ];
    let imp_n = imps.indexOf(imp);

    const severity = [
        'Low',
        'Medium',
        'High',
        'Critical'
    ];

    let n = Math.max(urg_n, imp_n);

    return {
        name: severity[n],
        number: n
    };
}


