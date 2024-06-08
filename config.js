export const config = {
    propInfo: {
        enhancedElement: {
            ro: true,
        },
        resolved: {
            ro: true,
        },
        rejected: {
            ro: true,
        }
    },
    positractions: [
        {
            do: 'de',
            ifAllOf: ['resolved'],
            pass: ['$0+', '`resolved`']
        },
        {
            do: 'de',
            ifAllOf: ['rejected'],
            pass: ['$0+', '`rejected`']
        }
    ]
};
