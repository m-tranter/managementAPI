const swears = ['fuck', 'fucking', 'cunt', 'wank', 'piss', 'bitch', 'ass', 'bastard', 'testswear'].join('|');
const regEx =  new RegExp(`\\b${swears}\\b`, 'i');
export { regEx };
