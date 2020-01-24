class Translate
{
    static rules(key, lang = 'es-GT')
    {
        const messages = use('App/Translate/'+lang+'/rules.js');
        return messages[key];
    }

    static crud(key, lang = 'es-GT')
    {
        const messages = use('App/Translate/'+lang+'/crud.js');
        return messages[key];
    }

    static status(key, lang = 'es-GT')
    {
        const messages = use('App/Translate/'+lang+'/status.js');
        return messages[key];
    }
}
module.exports = Translate
