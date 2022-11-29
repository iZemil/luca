module.exports = {
    delay: 500,
    baseUrl: 'https://www.npmjs.com/package',
    query: (baseUrl, item) => {
        return `${baseUrl}/${item}`;
    },
    handler: (response, item) => {
        return {
            item,
            data: response.data,
        };
    },
    items: ['foo', 'bar'],
};
