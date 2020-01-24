const Translate = use('App/Helpers/Translate')
class Required
{
	static validateArray(validate = {}, required = [], lang = 'es-GT')
    {
        let returnObj = {};
        required.map((row) => {
            if(Object.keys(validate).indexOf(row) !== -1)
            {
				if(validate[row] instanceof Array)
				{
					if(validate[row].length == 0)
	                {
	                    returnObj[row] = Translate.rules('empty', lang);
	                }
				}
				else
				{
					returnObj[row] = Translate.rules('not_array', lang);
				}
            }
            else
            {
                returnObj[row] = Translate.rules('required', lang);
            }
        })
        return returnObj;
    }

    static validateString(validate = {}, required = [], lang = 'es-GT')
    {
        let returnObj = {};
        required.map((row) => {
            if(Object.keys(validate).indexOf(row) !== -1)
            {
                if(validate[row] == '' || validate[row] == null)
                {
                    returnObj[row] = Translate.rules('empty', lang);
                }
            }
            else
            {
                returnObj[row] = Translate.rules('required', lang);
            }
        })
        return returnObj;
    }

	static validateExist(validate = {}, required = [], lang = 'es-GT')
    {
        let returnObj = {};
        required.map((row) => {
            if(Object.keys(validate).indexOf(row) === -1)
            {
                returnObj[row] = Translate.rules('required', lang);
            }
        })
        return returnObj;
    }

    static validateBoolean(validate = {}, required = [])
    {
        let returnObj = {};
        required.map((row) => {
            if(Object.keys(validate).indexOf(row) !== -1)
            {
                if(validate[row] != false   &&
                   validate[row] != 'false' &&
                   validate[row] != FALSE   &&
                   validate[row] != 'FALSE' &&
                   validate[row] != true    &&
                   validate[row] != 'true'  &&
                   validate[row] != TRUE    &&
                   validate[row] != 'TRUE'  &&
                   validate[row] != 0       &&
                   validate[row] != '0'     &&
                   validate[row] != 1       &&
                   validate[row] != '1')
                {
                    returnObj[row] = Translate.rules('not_boolean', lang);
                }
            }
            else
            {
                returnObj[row] = Translate.rules('required', lang);
            }
        })
        return returnObj;
    }
}

module.exports = Required
