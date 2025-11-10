console.log("connected!")

function header_section() {
    let headerContainer = document.createElement('header')
    let header = document.createElement('h1')
    header.textContent = 'Project Pal - Stay Organized'
    let sub = document.createElement('h2')
    sub.textContent = 'All of your projects in one place!'

    let new_project = document.createElement('button')
    new_project.textContent = 'New Project'
    new_project.id = 'add_button'

    new_project.addEventListener('click', function() {
        console.log('clicked')
        document.getElementById('project-form').style.display = 'flex';
    })

    let titleGroup = document.createElement('div');
    titleGroup.className = 'title-group'; // Add a class for styling
    titleGroup.appendChild(header);
    titleGroup.appendChild(sub);
    headerContainer.appendChild(titleGroup);
    headerContainer.appendChild(new_project);

    document.body.appendChild(headerContainer)
    }

function load_projects() {
    console.log('load entered')
    let container = document.getElementById('proj-container')
    if (!container) {
        container = document.createElement('div')
        container.id = 'proj-container'
        document.body.appendChild(container)
    }

    container.innerHTML = ''

    fetch('/projects')
    .then(function (response) {
        response.json()
            .then(function (data) {
                console.log(data)
                data.reverse().forEach(project => {
                    let project_container = document.createElement('div')
                    let name = document.createElement('h3')
                    let client = document.createElement('p')
                    let due = document.createElement('p')
                    let description = document.createElement('p')

                    let delete_button = document.createElement('button')
                    delete_button.textContent = 'delete'
                    delete_button.id = 'delete-button'

                    let edit_button = document.createElement('button')
                    edit_button.textContent = 'edit'
                    edit_button.id = 'edit-button'

                    name.textContent = project.name
                    client.textContent = project.client
                    due.textContent = project.due_date
                    description.textContent = project.description
                    delete_button.dataset.id = project.id

                    edit_button.dataset.project = JSON.stringify(project)

                    project_container.appendChild(name)
                    project_container.appendChild(client)
                    project_container.appendChild(due)
                    project_container.appendChild(description)
                    project_container.appendChild(delete_button)
                    project_container.appendChild(edit_button)

                    delete_button.addEventListener('click', delete_project)
                    edit_button.addEventListener('click', edit_project)

                    container.appendChild(project_container)
                })
            })
    })
    console.log('finished load')
}

function load_form() {
    console.log('load form entered')
    let form = document.createElement('form')

    let title = document.createElement('input')
    let client = document.createElement('input')
    let date = document.createElement('input')
    let description = document.createElement('input')

    let button = document.createElement('button')

    title.id = 'title-input'
    title.placeholder = 'Title'
    title.required = true
    title.type = 'text'
    
    client.id = 'client-input'
    client.placeholder = 'Client Name'
    client.required = true
    client.type = 'text'

    date.id = 'date-input'
    date.placeholder = 'Due Date (MM/DD/YYYY)'
    date.required = true
    date.type = 'text'

    description.id = 'description-input'
    description.placeholder = 'Project Description'
    description.required = true
    description.type = 'text'

    button.id = 'submit-button'
    button.type = 'submit'
    button.textContent = 'Add Project'

    form.id = 'project-form'

    form.append(title, client, date, description, button)
    document.body.appendChild(form)

    button.addEventListener('click', function() {
        console.log('hide form should happen')
        document.getElementById('project-form').style.display = 'none';
    })
    form.addEventListener('submit', add_project)
}

function add_project(event) {
    event.preventDefault()
    console.log("now recording")

    let t = document.getElementById('title-input')
    let t_text = t.value

    let c = document.getElementById('client-input')
    let c_text = c.value

    let dt = document.getElementById('date-input')
    let dt_text = dt.value

    let ds = document.getElementById('description-input')
    let ds_text = ds.value

    fetch("/projects", {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({title: t_text, client: c_text, due_date: dt_text, description: ds_text})
    })
    .then(function (response) {
        if (response.ok) {
            response.text()
                .then(function (data) {
                    console.log(data)
                    t.value = ''
                    c.value = ''
                    dt.value = ''
                    ds.value = ''
                    load_projects()
                })
            } else{
                console.error('sever responded with error: ', response.status)
            }
        })
    }

function delete_project(event) {
    event.preventDefault()
    console.log('delete clicked')

    const userConfirmed = confirm("Are you sure you want to delete this project?");
    if (userConfirmed) {
        let id = event.target.dataset.id;
        fetch(`/projects/${id}`, {
            method: 'DELETE'
        })
            .then(function (response) {
                response.text()
                    .then(function (data) {
                        console.log(data)
                        load_projects()
                    })
            })
        } else {
            console.log('user cancelled delete')
        }
}

function load_edit_form() {
    console.log('load edit form entered');
    let form = document.createElement('form');
    form.id = 'edit-form'; // Unique ID for the edit form
    form.style.display = 'none'; // Hide it by default

    // Hidden input to store the project ID
    let idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.id = 'edit-id-input';

    let name = document.createElement('input');
    name.id = 'edit-name-input';
    name.placeholder = 'Title';
    name.required = true;
    name.type = 'text';
    
    let client = document.createElement('input');
    client.id = 'edit-client-input';
    client.placeholder = 'Client Name';
    client.required = true;
    client.type = 'text';

    let date = document.createElement('input');
    date.id = 'edit-date-input';
    date.placeholder = 'Due Date (MM/DD/YYYY)';
    date.required = true;
    date.type = 'text';

    let description = document.createElement('input');
    description.id = 'edit-description-input';
    description.placeholder = 'Project Description';
    description.required = true;
    description.type = 'text';

    let save_button = document.createElement('button');
    save_button.id = 'save-button';
    save_button.type = 'submit';
    save_button.textContent = 'Save Changes';


    form.appendChild(idInput)
    form.appendChild(name)
    form.appendChild(client)
    form.appendChild(date)
    form.appendChild(description)
    form.appendChild(save_button)
    document.body.appendChild(form);

    form.addEventListener('submit', handle_save_edit);
}

function edit_project(event){
    console.log('edit button clicked');
    
    const project = JSON.parse(event.target.dataset.project);

    document.getElementById('edit-id-input').value = project.id; 
    document.getElementById('edit-name-input').value = project.name;
    document.getElementById('edit-client-input').value = project.client;
    document.getElementById('edit-date-input').value = project.due_date;
    document.getElementById('edit-description-input').value = project.description;

    document.getElementById('edit-form').style.display = 'flex';
}

function handle_save_edit(event) {
    event.preventDefault()
    console.log("saving edits...")

    const id = document.getElementById('edit-id-input').value;
    const name = document.getElementById('edit-name-input').value;
    const client = document.getElementById('edit-client-input').value;
    const dueDate = document.getElementById('edit-date-input').value;
    const description = document.getElementById('edit-description-input').value;

    const projectData = {
        name: name,
        client: client,
        "due-date": dueDate,
        description: description
    };

    fetch(`/projects/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    })
        .then(function (response) {
            response.text()
                .then(function (data) {
                    console.log(data)
                    document.getElementById('edit-form').style.display = 'none';
                    load_projects()
                })
        })
}

header_section()
load_form()
load_edit_form()
load_projects()


