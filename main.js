// main.js
import Dashboard from './js/Dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    // Создаём экземпляр дашборда, передав селектор контейнера
    const dashboard = new Dashboard('#dashboardContainer');

    // Кнопки добавления виджетов
    document.querySelector('[data-add="todo"]').addEventListener('click', () => {
        dashboard.addWidget('todo');
    });

    document.querySelector('[data-add="quote"]').addEventListener('click', () => {
        dashboard.addWidget('quote');
    });

    // Можно добавить пару виджетов сразу для демо
    dashboard.addWidget('todo');
    dashboard.addWidget('quote');
});