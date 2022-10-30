const inputData = document.querySelector('.form-input');
const list = document.querySelector('.suggestionlist');
const cardlist = document.querySelector('.cardlist');
const suggestion = document.querySelector('ul');
const form = document.querySelector('.form');

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

function delCard(a) {
    a.parentElement.remove();
}

cardlist.onclick = function(event) {
    let target = event.target;
    if(target.tagName === 'BUTTON') {
        delCard(target);
    }
};

function createCard(data) {
    const cardlistItem = document.createElement('li');
    cardlistItem.classList.add('cardlist-item');
    const content = document.createElement('p');
    content.innerHTML = `Name: ${data.name}<br>Owner: ${data.owner.login} <br>Stars: ${data.watchers} <br>`
    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    cardlistItem.appendChild(content);
    cardlistItem.appendChild(closeButton);
    cardlist.appendChild(cardlistItem);
    inputData.value = '';
    removeAllChildNodes(suggestion);
}

function getData (a) {
    return fetch(`https://api.github.com/search/repositories?q=${a}&per_page=5`)
                .then((res) => res.json())
                .then((res) => res.items)
                .then((res) => {
                    createCard(res[0]);
                })
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
        return fetch(`https://api.github.com/search/repositories?q=${inputData.value}&per_page=5`)
        .then((res) => res.json())
        .then((res) => {
            createCard(res.items[0])
        })
        .catch((e) => e)
})

class Search {
    constructor(data) {
        this.data = data;
        this.data.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 500));
        //this.data.addEventListener('submit', this.getInfo.bind(this))
    };
    searchUsers() {
        if(!this.data.value) {
            removeAllChildNodes(list);
        } else {
            return fetch(`https://api.github.com/search/repositories?q=${this.data.value}&per_page=5`)
                .then((res) => res.json())
                .then((res) => {
                    var fragment = document.createDocumentFragment();
                    let count = 0;
                    res.items.forEach((item) => {
                        if(count < 5) {
                            count++;
                            var element = document.createElement('li');
                            element.innerHTML = `${item.name}`;  
                            element.classList.add('suggestionlist-item');
                            fragment.appendChild(element);
                        }
                    });
                    if(list.childNodes.length === 0) {
                        list.append(fragment);
                        list.onclick = function(event) {
                            let target = event.target;
                            getData(target.textContent); 
                        };
                    } else {
                        removeAllChildNodes(list);
                        list.append(fragment);
                        list.onclick = function(event) {
                            let target = event.target;
                            getData(target.textContent);
                        };
                    }
                })
                .catch((e) => e)
        } 
    };
    // getInfo() {
    //     return fetch(`https://api.github.com/search/repositories?q=${this.data.value}`)
    //             .then((res) => res.json())
    //             .then((res) => {
    //                 console.log(res.items)
    //             })
    //             .catch((e) => e)
    // };
    debounce(fn, debounceTime) {
        let timeout;
        return function() {
        const fnCall = () => {
          fn.apply(this, arguments);
        };
    
        clearTimeout(timeout);
    
        timeout = setTimeout(fnCall, debounceTime);
      }
    };
};

new Search(inputData);
