import todoHomeView from '../Views/todo.html';
import UpdateTodoFormController from '../controllers/UpdateTodoFormController'
import CreateTodoFormController from '../controllers/CreateTodoFormController';
import ListTodoService from '../services/ListTodoService'
import AuthenticateUserService from '../services/AuthenticateUserService'

class TodoViewController {
    constructor() {
        this.listTodoService = new ListTodoService();
        this.createTodoFormController = new CreateTodoFormController();
    }
    async create() {
        const user = JSON.parse(sessionStorage.getItem('authenticatedUser'));
        if(user){
            const element = document.createElement('div');
            element.innerHTML = todoHomeView;
            rootContainer.appendChild(element);
            await this.loadTodos(user.id)
            this._handleEndSession();
            this._handleOpenCreateTodoModal();
            return rootContainer;
        } 
            window.location.hash = "#"
        
    }
    async loadTodos(user) {
        const todo = await this.listTodoService.execute(user);
        const todosCard = await this._todosMount(todo);

        return todosCard;
    }
    async _todosMount(todo) {
        const updateTodoForm = new UpdateTodoFormController();
        todosContainer.innerHTML = '';
        const todoCard = todo.forEach(element => {
            
            const container = document.createElement('div');
            const title = document.createElement('button');
            const description = document.createElement('p');
            const status = document.createElement('span');
            const date = document.createElement('span');

            container.setAttribute('id', element.id);
            container.setAttribute('class', 'todoCard');
            title.innerText = element.title;
            title.setAttribute('class', 'openUpdateTodoButton');
            title.addEventListener('click', () => {
                updateTodoForm.create(element.id)
            })
            description.innerText = element.description;
            status.innerText = element.status;
            date.innerText = element.date;
            
            

            container.append(title, description, status, date);
            todosContainer.appendChild(container);

            });
        return todoCard;
    }
    _handleEndSession() {
        const authenticateUserService = new AuthenticateUserService()
        endSession.addEventListener('click', element => {
            authenticateUserService.remove();
            window.location.hash = "#";
            return element;
        })
    }
    _handleOpenCreateTodoModal() {
        openCreateTodoModal.addEventListener('click', () => {
            modal.style.display = "flex";
            this.createTodoFormController.create();
        })
    }
}

export default TodoViewController;