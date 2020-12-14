class SearchRepos {
    constructor() {
        this.app = document.querySelector('#app');

        this.container = this.createElement('div', 'wrapper');
        
        this.title = this.createElement('h2', 'title');
        this.title.innerHTML = 'Search Github Repositories';
        this.container.append(this.title);

        this.input = this.createElement('input', 'search-input');
        this.input.addEventListener('keyup', this.debounce(this.search.bind(this), 500));
        this.container.append(this.input);

        this.list = this.createElement('ul', 'list');
        this.container.append(this.list);

        this.likked = this.createElement('div', 'likked-repos');
        this.container.append(this.likked);

        this.owner = []
        this.stars = []

        this.list.addEventListener('click', (e) => {
            if(e.target.parentNode.tagName !== 'UL') return
            const ul = this.createElement('ul', 'list-repos')
            const li = this.createElement('li', 'likked-li')
            li.innerHTML = e.target.innerHTML;
            const img = this.createElement('img', 'lala')
            img.src = './img/delete.png';
            for(let i = 0; i < 3; i++) {
                const li = document.createElement('li')
                li.classList.add('likked-li')
                if(i === 0) {
                    li.innerHTML = `name: ${e.target.innerHTML}`;
                    ul.append(li)
                }
                if(i === 1) {
                    li.innerHTML = `owner: ${this.owner[e.target.dataset.id]}`
                    ul.append(li)
                }
                if(i === 2) {
                    li.innerHTML = `stars: ${this.stars[e.target.dataset.id]}`
                    ul.append(li)
                }
            }
            ul.append(img)
            this.likked.append(ul)
            img.addEventListener('click', (e) => {
                ul.style.display = 'none'
            })
            this.input.value = ''
            this.list.innerHTML = ''
        })
        this.app.append(this.container);
    }
    createElement(tagName, className) {
        const elem = document.createElement(tagName);
        elem.classList.add(className);
        return elem;
    }
    async search() {
        if(this.input.value != '') {
            return await fetch(`https://api.github.com/search/repositories?q=${this.input.value}&per_page=5`)
            .then(response => response.json())
            .then(res => {
                const {items} = res
                this.list.innerHTML = ''
                this.owner = []
                this.stars = []
                items.forEach((item, index) => {
                        this.owner.push(item.owner.login)
                        this.stars.push(item.stargazers_count)
                        const li = document.createElement('li')
                        li.setAttribute(`data-id`, `${index}`)
                        li.classList.add('search-rep')
                        li.innerHTML = `${item.name}`
                        this.list.append(li)
                })
            })
        } else {
            this.list.innerHTML = '';
        }
    }
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null
                if(!immediate) func.apply(context, args)
            }
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait)
            if(callNow) func.apply(context, args)
        }
    }
}

new SearchRepos()