const swears = ['fuck', 'fucking', 'cunt', 'wank', 'piss', 'bitch', 'ass', 'bastard', 'testswear'].join('|');
const regEx =  new RegExp(`\\b${swears}\\b`, 'i');

module.exports = { regEx };
