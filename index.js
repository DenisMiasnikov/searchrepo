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
    cardlistItem.innerHTML = `<div>Name: ${data.name}<br>Owner: ${data.owner.login} <br>Stars: ${data.watchers} <br></div><button>`; 
    cardlistItem.querySelector('div').classList.add('content');
    cardlistItem.querySelector('button').classList.add('close');
    cardlist.appendChild(cardlistItem);
    inputData.value = '';
    removeAllChildNodes(list);
}

async function getData (a) {
    try {
        const res = await fetch(`https://api.github.com/search/repositories?q=${a}&per_page=5`);
        const jSon = await res.json();
        const items = jSon.items;
        createCard(items[0]);
    } catch(e) {
        console.log(e)
    }
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const res = await fetch(`https://api.github.com/search/repositories?q=${inputData.value}&per_page=5`)
        const jSon = await res.json();
        const items = jSon.items;
        createCard(items[0]);
    } catch(e) {
        console.log(e)
    }
})

class Search {
    constructor(data) {
        this.data = data;
        this.data.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 500));
        //this.data.addEventListener('submit', this.getInfo.bind(this))
    };
    async searchUsers() {
        if(!this.data.value) {
            removeAllChildNodes(list);
        } else {
            try {
                const res = await fetch(`https://api.github.com/search/repositories?q=${this.data.value}&per_page=5`);
                const jSon = await res.json();
                var fragment = document.createDocumentFragment();
                let count = 0;
                jSon.items.forEach((item) => {
                    if(count < 5) {
                        //console.log(item)
                        count++;
                        var element = document.createElement('button');
                        element.innerHTML = `${item.name}`;  
                        element.classList.add('suggestionlist-item');
                        fragment.appendChild(element);
                    }
                });
            } catch(e) {
                console.log(e)
            }
        }
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
    }
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
