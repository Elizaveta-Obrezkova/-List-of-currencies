export default class Api {
    constructor(host) {
        this._host = host;
        this._getJsonOrError = this._getJsonOrError.bind(this);
        this._getHeaders = this._getHeaders.bind(this);
    }

    _getJsonOrError(res) {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject(`Что-то пошло не так: ${res.status}`);
    }

    _getHeaders() {
        return {
            'content-type': 'application/json',
        }
    }

    getList() {
        return fetch(`${this._host}/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1`, {
            headers: this._getHeaders(),
        })
            .then(this._getJsonOrError)
    }

}

class Row {
    constructor({ data, selector }) {
        this._id = data.id;
        this._symbol = data.symbol;
        this._name = data.name;
        this._template = selector;
    }

    _getTemplate() {
        const rowElement = document.querySelector(this._template).content.querySelector('.element').cloneNode(true);
        return rowElement;
    }

    createRow() {
        this._element = this._getTemplate();
        this._element.querySelector('.element-id').textContent = this._id;
        this._element.querySelector('.element-symbol').textContent = this._symbol;
        this._element.querySelector('.element-name').textContent = this._name;
        return this._element;
    }

    addSelector() {
        this._element.querySelector('.element').classList.add('highlight-row');
    }

}

function createRow(item) {
    const row = new Row({
        data: item,
        selector: '#element-template',
    });
    const placeElement = row.createRow();
    return placeElement
};

const api = new Api('https://api.coingecko.com/api');

api.getList()
    .then((items) => {
        items.forEach(item => {
            const rowElement = createRow(item);
            if (items.indexOf(item) < 5) {
                rowElement.classList.add('highlight-row');
            }
            if (item.symbol === 'usdt') {
                rowElement.classList.add('find-row');
            }
            document.querySelector('table').append(rowElement)
        })
    })
    .catch((err) => {
        console.log(err);
    })



