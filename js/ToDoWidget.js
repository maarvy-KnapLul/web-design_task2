// js/ToDoWidget.js
import UIComponent from './UIComponent.js';

export default class ToDoWidget extends UIComponent {
    constructor(config) {
        super({ title: config.title || 'Мои задачи', id: config.id });
        // Приватное состояние — список задач
        this.tasks = config.initialTasks ? [...config.initialTasks] : [
            { id: 't1', text: 'Прочитать лекцию по ООП', completed: false },
            { id: 't2', text: 'Сделать дашборд', completed: true },
        ];
        this.element = null;
    }

    // Отрисовка всего виджета
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'widget';
        wrapper.dataset.widgetId = this.id;
        wrapper.dataset.type = 'todo';

        // Шапка
        const header = document.createElement('div');
        header.className = 'widget-header';
        header.innerHTML = `
            <span>📋 ${this.title}</span>
            <div class="widget-controls">
                <button class="minimize-btn" title="Свернуть">🗕</button>
                <button class="close-btn" title="Удалить">✕</button>
            </div>
        `;

        // Контент
        const content = document.createElement('div');
        content.className = 'widget-content';
        content.innerHTML = `
            <ul class="todo-list" id="todo-list-${this.id}"></ul>
            <form class="add-todo-form">
                <input type="text" placeholder="Новая задача..." required>
                <button type="submit">➕</button>
            </form>
        `;

        wrapper.appendChild(header);
        wrapper.appendChild(content);
        this.element = wrapper;

        // Наполнить список задачами
        this.renderTasks();

        // Подписка на события (через делегирование внутри виджета)
        this.attachEvents();

        return wrapper;
    }

    // Обновить отображение списка задач
    renderTasks() {
        const list = this.element.querySelector('.todo-list');
        if (!list) return;
        list.innerHTML = '';
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.dataset.taskId = task.id;
            li.innerHTML = `
                <input type="checkbox" class="todo-check" ${task.completed ? 'checked' : ''}>
                <span class="todo-text">${this.escapeHtml(task.text)}</span>
                <button class="delete-todo" title="Удалить">🗑️</button>
            `;
            list.appendChild(li);
        });
    }

    // Простейшая защита от XSS
    escapeHtml(unsafe) {
        return unsafe.replace(/[&<>"]/g, function(m) {
            if(m === '&') return '&amp;'; if(m === '<') return '&lt;';
            if(m === '>') return '&gt;'; if(m === '"') return '&quot;';
            return m;
        });
    }

    // Навесить обработчики на элементы виджета
    attachEvents() {
        // Используем делегирование от корневого элемента
        this.element.addEventListener('click', (e) => {
            // Удаление todo
            if (e.target.classList.contains('delete-todo')) {
                const li = e.target.closest('.todo-item');
                if (li && li.dataset.taskId) {
                    e.stopPropagation();
                    this.removeTask(li.dataset.taskId);
                }
            }

            // Сворачивание / разворачивание
            if (e.target.classList.contains('minimize-btn')) {
                e.stopPropagation();
                this.minimize();
            }

            // Закрытие (удаление) виджета
            if (e.target.classList.contains('close-btn')) {
                e.stopPropagation();
                // Диспатчим событие, чтобы Dashboard мог убрать виджет из коллекции
                const removeEvent = new CustomEvent('removewidget', { detail: { widgetId: this.id } });
                document.dispatchEvent(removeEvent);
            }
        });

        // Изменение чекбокса (отметка выполнения)
        this.element.addEventListener('change', (e) => {
            if (e.target.classList.contains('todo-check')) {
                const li = e.target.closest('.todo-item');
                if (li && li.dataset.taskId) {
                    const task = this.tasks.find(t => t.id === li.dataset.taskId);
                    if (task) {
                        task.completed = e.target.checked;
                        li.classList.toggle('completed', task.completed);
                    }
                }
            }
        });

        // Добавление новой задачи
        const form = this.element.querySelector('.add-todo-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('input');
                const text = input.value.trim();
                if (text) {
                    const newTask = {
                        id: 'task_' + Date.now() + Math.random().toString(36).substr(2, 4),
                        text: text,
                        completed: false
                    };
                    this.tasks.push(newTask);
                    this.renderTasks(); // перерисовать список
                    input.value = '';
                }
            });
        }
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.renderTasks();
    }

    // Переопределяем destroy для дополнительной очистки (хотя в данном случае достаточно базового)
    destroy() {
        // Убираем ссылки на DOM, элемент удалится в родителе
        super.destroy();
    }
}