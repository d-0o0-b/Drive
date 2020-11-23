
export const rexFilter = (originString) => {
    var result = originString.replace(/&([^&;]+);/g, function(matchStr, b) {
        var entity = {
            quot: '"',
            lt: '<',
            gt: '>',
            apos: "'",
            amp: '&',
            ldquo: '“',
            rdquo: '”'
        };
        var r = entity[b];
        return typeof r === 'string' ? r : matchStr;
    });
    return result;
}