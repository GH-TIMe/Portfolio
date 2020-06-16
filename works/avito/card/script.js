(async function IIFE() {

    class Card {
        constructor(repo, lastCommitDate, languages, contributors) {
            this.repo = repo;
            this.lastCommitDate = lastCommitDate.slice(0, lastCommitDate.indexOf("T"));
            this.languages = languages;
            this.contributors = contributors;
        }

        static async build(url) {
            const repo = await Card.request(url);
            const searchURL = `https://api.github.com/repos/${repo.full_name}/`;

            const lastCommitDate = (await Card.request(searchURL + 'commits?per_page=1'))[0].commit.author.date;
            const languages = Object.keys(await Card.request(repo.languages_url));
            const contributors = await Card.request(searchURL + 'contributors?per_page=10');

            return new Card(repo, lastCommitDate, languages, contributors);
        }

        static async request(url) {
            return (await (await fetch(url)).json());
        }

        createCard() {
            this.card = document.querySelector(".card__content");
        }

        fillCard() {
            let contributors = '';
            this.contributors.forEach(contr => {
                contributors += `
                    <li class="contributors__person">
                        <a class="contributors__link" href="${contr.html_url}" target="_blank">
                            <img class="contributors__avatar" src="${contr.avatar_url}" alt="avatar">
                        </a>
                    </li>
                `;
            });
            let languages = '';
            if (!this.languages) {
                languages = '<li class="languages__item">not found</li>';
            } else {
                this.languages.forEach(lang => {
                    languages += `<li class="languages__item">${lang}</li>`;
                });
            }
            this.card.innerHTML = `
                <div class="author">
                    <img class="author__img" src="${this.repo.owner.avatar_url}" alt="logo">
                    <h2 class="card__title hidden">
                        <a class="link" href="${this.repo.owner.html_url}" target="_blank">${this.repo.owner.login}</a>
                    </h2>
                </div>
                <div class="card__info">
                    <h2 class="card__title">
                        <a class="link link_show" href="${this.repo.owner.html_url}" target="_blank">${this.repo.owner.login}</a>
                        <span class="link_show">/</span>
                        <a class="link" href="${this.repo.html_url}" target="_blank">${this.repo.name}</a>
                    </h2>
                    <p class="card__description">${(this.repo.description) ? this.repo.description : "no description"}</p>
                    <ul class="languages">
                        <li>Languages:</li>${languages}
                    </ul>
                    <ul class="contributors">
                        ${contributors}
                    </ul>
                    <div class="card__footer">
                        <a class="stars" href="https://github.com/${this.repo.full_name}/stargazers" target="_blank">
                            <svg class="stars__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14.82" height="14.16">
                                <use xlink:href="#stars">
                            </svg>
                            <span class="stars__count">${this.repo.stargazers_count}<span>
                        </a>
                        <a class="repo__commit-date long" href="https://github.com/${this.repo.full_name}/commit/master"><time datetime="${this.lastCommitDate}">${this.lastCommitDate}</time></a>
                    </div>
                </div>
            `;
        }
    }

    const localURL = window.location.href;
    const card = await Card.build(localURL.slice(localURL.indexOf("=") + 1));
    card.createCard();
    card.fillCard();    
})();