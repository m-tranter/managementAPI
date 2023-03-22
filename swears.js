const swears = ['fuck', 'cunt', 'wank', 'piss', 'bitch', 'ass', 'bastard', 'mark', 'testswear'].join('|');
const bound = "(\s+)|([\p{P}\p{S}])";
const regEx =  new RegExp(`/${bound}|${swears}|${bound}/i`);


module.exports = { regEx };
