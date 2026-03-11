// js/Dashboard.js
import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';

export default class Dashboard {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) throw new Error('Контейнер не найден');
        this.widgets = []; // массив активных виджетов

        // Слушаем глобальное событие удаления от виджетов
        document.addEventListener('removewidget', (e) => {
            const { widgetId } = e.detail;
            this.removeWidget(widgetId);
        });
    }

    addWidget(widgetType) {
        let newWidget;
        const widgetId = 'w' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);

        if (widgetType === 'todo') {
            newWidget = new ToDoWidget({ title: 'Задачи', id: widgetId });
        } else if (widgetType === 'quote') {
            newWidget = new QuoteWidget({ title: 'Цитата дня', id: widgetId });
        } else {
            console.warn('Неизвестный тип виджета');
            return;
        }

        // Отрисовываем и сохраняем
        const widgetElement = newWidget.render();
        this.container.appendChild(widgetElement);
        this.widgets.push(newWidget);
    }

    removeWidget(widgetId) {
        const index = this.widgets.findIndex(w => w.id === widgetId);
        if (index !== -1) {
            const widget = this.widgets[index];
            widget.destroy();   // удаляет DOM-элемент и чистит ссылки
            this.widgets.splice(index, 1);
        }
    }

    // Получить все виджеты (на всякий случай)
    getWidgets() {
        return this.widgets;
    }
}