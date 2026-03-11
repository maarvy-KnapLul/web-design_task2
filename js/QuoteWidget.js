// js/QuoteWidget.js
import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
    constructor(config) {
        super({ title: config.title || 'Вдохновение', id: config.id });
        // Локальный массив цитат (можно заменить на API позже)
        this.quotes = [
            { text: 'Будьте тем изменением, которое хотите видеть в мире.', author: 'Махатма Ганди' },
            { text: 'Всё, что вы когда-либо хотели, находится на другой стороне страха.', author: 'Джордж Аддэр' },
            { text: 'Сделай сегодня то, что другие не хотят, завтра будешь жить так, как другие не могут.', author: 'Джаред Лето' },
            { text: 'Путь в тысячу ли начинается с первого шага.', author: 'Лао-цзы' },
            { text: 'Лучшее время посадить дерево было 20 лет назад. Следующее лучшее время — сегодня.', author: 'Китайская пословица' },
        ];
        this.currentQuote = this.getRandomQuote();
        this.element = null;
    }

    getRandomQuote() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'widget';
        wrapper.dataset.widgetId = this.id;
        wrapper.dataset.type = 'quote';

        const header = document.createElement('div');
        header.className = 'widget-header';
        header.innerHTML = `
            <span>💬 ${this.title}</span>
            <div class="widget-controls">
                <button class="minimize-btn" title="Свернуть">🗕</button>
                <button class="close-btn" title="Удалить">✕</button>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'widget-content';
        content.innerHTML = `
            <div class="quote-text">${this.currentQuote.text}</div>
            <div class="quote-author">— ${this.currentQuote.author}</div>
            <button class="refresh-quote">⟳ Случайная цитата</button>
        `;

        wrapper.appendChild(header);
        wrapper.appendChild(content);
        this.element = wrapper;

        this.attachEvents();
        return wrapper;
    }

    attachEvents() {
        this.element.addEventListener('click', (e) => {
            if (e.target.classList.contains('refresh-quote')) {
                this.currentQuote = this.getRandomQuote();
                const textDiv = this.element.querySelector('.quote-text');
                const authorDiv = this.element.querySelector('.quote-author');
                if (textDiv) textDiv.textContent = this.currentQuote.text;
                if (authorDiv) authorDiv.innerHTML = `— ${this.currentQuote.author}`;
            }

            if (e.target.classList.contains('minimize-btn')) {
                e.stopPropagation();
                this.minimize();
            }

            if (e.target.classList.contains('close-btn')) {
                e.stopPropagation();
                const removeEvent = new CustomEvent('removewidget', { detail: { widgetId: this.id } });
                document.dispatchEvent(removeEvent);
            }
        });
    }
}