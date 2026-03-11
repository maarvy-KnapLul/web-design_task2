// js/UIComponent.js
export default class UIComponent {
    constructor(config) {
        if (new.target === UIComponent) {
            throw new Error('UIComponent — абстрактный класс, нельзя создать экземпляр');
        }
        this.id = config.id || 'widget-' + Math.random().toString(36).substr(2, 9);
        this.title = config.title || 'Виджет';
        this.element = null; // будет заполнен после render()
    }

    // Возвращает DOM-элемент (обёртку виджета)
    render() {
        throw new Error('Метод render() должен быть реализован в наследнике');
    }

    // Корректное удаление виджета
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
        // Очищаем ссылки (слушатели событий удаляются автоматически вместе с элементом,
        // если использовались addEventListener на самом элементе или делегирование)
        this.element = null;
    }

    // Общий метод для сворачивания (пример)
    minimize() {
        if (!this.element) return;
        const content = this.element.querySelector('.widget-content');
        if (content) {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Общий метод для закрытия (удаления) — можно вызывать извне
    close() {
        this.destroy();
    }
}