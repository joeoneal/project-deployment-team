console.log('connected!')

function render_header(show_logout) {
    let headerContainer = document.createElement('header')
    let title = document.createElement('h1')
    title.textContent = "Ticket Suppport"
    headerContainer.append(title)

    if (show_logout) {
        let subtitle = document.createElement('h2')
        let logoutButton = document.createElement('button')
        let name = localStorage.getItem('first-name') || 'User'

        subtitle.textContent = `Welcome, ${name}!`
        logoutButton.innerText = "LOGOUT"
        logoutButton.setAttribute('id', 'logout-button')

        let switchLabel = document.createElement('label');
        switchLabel.className = 'switch';
    
        let checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
    
        if (localStorage.getItem('theme') === 'dark') {
            checkBox.checked = true;
        }
    
        let sliderSpan = document.createElement('span');
        sliderSpan.className = 'slider';
    
        checkBox.addEventListener('change', function() {
            if (checkBox.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });

        switchLabel.appendChild(checkBox);
        switchLabel.appendChild(sliderSpan);
    
        logoutButton.onclick = handle_logout
        headerContainer.append(subtitle, switchLabel, logoutButton)
    }
    document.body.prepend(headerContainer)
}

function home_layout() {
    // header section //
    document.body.innerHTML = ''
    render_header(true)

    // body section //
    let bodyContainer = document.createElement('div')
    bodyContainer.setAttribute('id', 'body-container')

    let toolbar = document.createElement('div')
    toolbar.setAttribute('id', 'toolbar')
    
    let bodyTitle = document.createElement('h3')
    let newTicketButton = document.createElement('button')
    let t_title = document.createElement('h4')
    let t_urgency= document.createElement('h4')
    let t_status = document.createElement('h4')


    bodyTitle.textContent = 'Current Tickets'
    newTicketButton.innerText = 'New Ticket'
    t_title.textContent= "Title"
    t_urgency.textContent = 'Urgency'
    t_status.textContent = 'Status'
    newTicketButton.setAttribute('id', 'new-ticket')

    newTicketButton.addEventListener('click', function() {
        console.log('clicked new ticket')
        document.getElementById('ticket-form').style.display = 'flex';
    })
    
    toolbar.append(bodyTitle, newTicketButton)
    bodyContainer.append(toolbar, t_title, t_urgency, t_status)
    document.body.append(bodyContainer)
}

function load_tickets() {
    // console.log('load entered')
    let container = document.getElementById('tickets-container')
    if (!container) {
        container = document.createElement('div')
        container.id = 'tickets-container'
        document.body.appendChild(container)
    }

    container.innerHTML = ''

    fetch('/tickets')
    .then(function (response) {
        response.json()
            .then(function (data) {
                console.log(data)
                data.reverse().forEach(ticket => {
                    let ticket_container = document.createElement('div')
                    let title = document.createElement('h3')
                    let urgency = document.createElement('p')
                    let status = document.createElement('p')

                    let delete_button = document.createElement('button')
                    delete_button.textContent = 'delete'
                    delete_button.id = 'delete-button'

                    let edit_button = document.createElement('button')
                    edit_button.textContent = 'edit'
                    edit_button.id = 'edit-button'

                    title.textContent = ticket.title
                    urgency.textContent = ticket.urgency
                    status.textContent = ticket.status
                    delete_button.dataset.id = ticket.id

                    if (ticket.urgency === 'Critical') {
                        urgency.className = 'critical-text'; 
                    }

                    edit_button.dataset.ticket = JSON.stringify(ticket)

                    ticket_container.append(title, urgency, status, delete_button, edit_button)

                    delete_button.addEventListener('click', delete_ticket)
                    edit_button.addEventListener('click', edit_ticket)

                    container.appendChild(ticket_container)
                })
            })
    })
    console.log('load finished')
}

function new_ticket_form() {
    let form = document.createElement('form')
    let title = document.createElement('input')
    let urgency = document.createElement('select')
    let status = document.createElement('select')
    let button = document.createElement('button')

    title.id = 'title-input'
    title.placeholder = 'Title'
    title.required = true
    title.type = 'text'
    
    urgency.id = 'urgency-input'
    urgency.required = true
    let urgency_levels = ['Select Urgency', 'Low', 'Medium', 'High', 'Critical']
    urgency_levels.forEach((level, index) => {
        let option = document.createElement('option')
        option.textContent = level
        option.value = level

        if (index === 0) {
            option.value = "" // Empty value triggers the 'required' check
            option.disabled = true // User can't select it again
            option.selected = true // Selected by default
        }
        urgency.appendChild(option)
    })

    status.id = 'status-input'
    status.required = true
    let statusLevels = ['Select Status', 'Open', 'In Progress', 'Closed']
    
    statusLevels.forEach((level, index) => {
        let option = document.createElement('option')
        option.textContent = level
        option.value = level
        
        // Logic for the "Placeholder"
        if (index === 0) {
            option.value = ""
            option.disabled = true
            option.selected = true
        }
        status.appendChild(option)
    })

    button.id = 'submit-button'
    button.type = 'submit'
    button.textContent = 'Add Ticket'

    form.id = 'ticket-form'

    form.append(title, urgency, status, button)
    
    button.addEventListener('click', hide_form)
    form.addEventListener('submit', add_ticket)

    document.body.append(form)
    form.style.display = 'None'

}

function hide_form() {
    document.getElementById('ticket-form').style.display = 'None'
    console.log('form should be hidden')
}

function add_ticket(event) {
    event.preventDefault()
    console.log('add ticket clicked')

    let t = document.getElementById('title-input')
    let t_text = t.value

    let u = document.getElementById('urgency-input')
    let u_text = u.value

    let s = document.getElementById('status-input')
    let s_text = s.value

    fetch("/tickets", {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({title: t_text, urgency: u_text, status: s_text})
    })
    .then(function (response) {
        if (response.ok) {
            response.text()
                .then(function (data) {
                    console.log(data)
                    t.value = ''
                    u.value = ''
                    s.value = ''
                    load_tickets()
                })
            } else{
                console.error('sever responded with error: ', response.status)
            }
        })
}

function delete_ticket(event) {
    event.preventDefault()
    console.log('delete clicked')

    const userConfirmed = confirm("Are you sure you want to delete this ticket?");
    if (userConfirmed) {
        let id = event.target.dataset.id;
        fetch(`/tickets/${id}`, {
            method: 'DELETE'
        })
            .then(function (response) {
                response.text()
                    .then(function (data) {
                        console.log(data)
                        load_tickets()
                    })
            })
        } else {
            console.log('user cancelled delete')
        }
}

function load_edit_form() {
    console.log('launching edit form');
    let form = document.createElement('form');
    form.id = 'edit-form'; 
    form.style.display = 'none'; 

    let idInput = document.createElement('input');
    idInput.type = 'hidden';
    idInput.id = 'edit-id-input';

    let title = document.createElement('input');
    title.id = 'edit-title-input';
    title.placeholder = 'Title';
    title.required = true;
    title.type = 'text';
    
    let urgency = document.createElement('select')
    urgency.id = 'edit-urgency-input'
    urgency.required = true
    let urgency_levels = ['Select Urgency', 'Low', 'Medium', 'High', 'Critical']
    urgency_levels.forEach((level, index) => {
        let option = document.createElement('option')
        option.textContent = level
        option.value = level

        if (index === 0) {
            option.value = "" 
            option.disabled = true 
            option.selected = true 
        }
        urgency.appendChild(option)
    })

    let status = document.createElement('select')
    status.id = 'edit-status-input'
    status.required = true
    let statusLevels = ['Select Status', 'Open', 'In Progress', 'Closed']
    
    statusLevels.forEach((level, index) => {
        let option = document.createElement('option')
        option.textContent = level
        option.value = level
        
        // Logic for the "Placeholder"
        if (index === 0) {
            option.value = ""
            option.disabled = true
            option.selected = true
        }
        status.appendChild(option)
    })

    let save_button = document.createElement('button');
    save_button.id = 'save-button';
    save_button.type = 'submit';
    save_button.textContent = 'Save Changes';


    form.appendChild(idInput)
    form.appendChild(title)
    form.appendChild(urgency)
    form.appendChild(status)
    form.appendChild(save_button)
    document.body.appendChild(form);

    form.addEventListener('submit', handle_save_edit);
}

function edit_ticket(event) {
    console.log('edit button clicked');
    
    const ticket = JSON.parse(event.target.dataset.ticket);

    document.getElementById('edit-id-input').value = ticket.id; 
    document.getElementById('edit-title-input').value = ticket.title;
    document.getElementById('edit-urgency-input').value = ticket.urgency;
    document.getElementById('edit-status-input').value = ticket.status;


    document.getElementById('edit-form').style.display = 'flex';
}

function handle_save_edit(event) {
    event.preventDefault()
    console.log("saving edits...")

    const id = document.getElementById('edit-id-input').value;
    const title = document.getElementById('edit-title-input').value;
    const urgency = document.getElementById('edit-urgency-input').value;
    const status = document.getElementById('edit-status-input').value;

    const ticketData = {
        title: title,
        urgency: urgency,
        status: status
    };

    fetch(`/tickets/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
    })
        .then(function (response) {
            response.text()
                .then(function (data) {
                    console.log(data)
                    document.getElementById('edit-form').style.display = 'none';
                    load_tickets()
                })
        })
}



// AUTHENTICATION STUFF BELOW //
function login_form() {
    document.body.innerHTML = ''
    render_header(false)
    let login_container = document.createElement('div')
    login_container.id = 'login-container'

    let form = document.createElement('form')
    form.id = 'auth-form'

    let f_name = document.createElement('input')
    let l_name = document.createElement('input')
    let email = document.createElement('input')
    let password = document.createElement('input')

    f_name.id = 'first'
    f_name.placeholder = 'First name'
    f_name.type = 'text'
    f_name.style.display = 'none'

    l_name.id = 'last'
    l_name.placeholder = 'Last name'
    l_name.type = 'text'
    l_name.style.display = 'none'

    email.id = 'email'
    email.placeholder = 'Email address'
    email.required = true
    email.type = 'text'

    password.id = 'password'
    password.placeholder = 'Password'
    password.required = true
    password.type = 'password'

    let submit_button = document.createElement('button')
    submit_button.id = 'submit-button'
    submit_button.textContent = 'Login'
    submit_button.type = 'submit'

    let toggle_text = document.createElement('span')
    toggle_text.textContent = " Don't have an account?"
    toggle_text.style.cursor = 'pointer'
    toggle_text.style.marginLeft = '10px'

    toggle_text.addEventListener('click', function() {
        if (f_name.style.display === 'none') {
            f_name.style.display = 'block'
            l_name.style.display = 'block'

            f_name.required = true
            l_name.required = true

            submit_button.textContent = 'Register'
            toggle_text.textContent = " Already have an account?"
        } else {
            f_name.style.display = 'none'
            l_name.style.display = 'none'

            f_name.required = false
            l_name.required = false

            submit_button.textContent = 'Login'
            toggle_text.textContent = " Don't have an account?"
        }
    })

    form.append(f_name, l_name, email, password, submit_button, toggle_text)

    form.addEventListener('submit', handle_authorization)
    login_container.append(form)
    document.body.append(login_container)
}

function handle_authorization(event) {
    event.preventDefault()

    let submit = document.getElementById('submit-button')

    if (submit.textContent === 'Register') {
        register_user()
    } else {
        login_user()
    }
}

function register_user() {
    console.log('starting registration')

    let first = document.getElementById('first').value
    let last = document.getElementById('last').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            first_name: first, 
            last_name: last, 
            email: email, 
            password: password
        })
    })
    .then(response => {
        response.text().then(text => {
            if (response.ok) {
                alert("Registration successful! Please log in.");
                location.reload(); 
            } else {
                alert("Registration Error: " + text);
            }
        });
    });
}

function login_user() {
    console.log('logging in')

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    fetch('/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: email, 
            password: password 
        })
    })
    .then(response => {
        response.text().then(text => {
            if (response.ok) {
                console.log("Server response:", text);
                let parts = text.split(':')
                let sessionId = parts[1]
                let first = parts[2]

                console.log(`session id is ${sessionId}`)
                console.log(`name is ${first}`)

                createSession(sessionId)
                localStorage.setItem('first-name', first)
                main();
            } else {
                alert(text);
            }
        });
    });
}

function handle_logout() {
    delete_session()
    localStorage.removeItem('first-name')
}

function main() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    const userId = localStorage.getItem('sessionID')
    if (userId) {
        home_layout()
        new_ticket_form()
        load_edit_form()
        load_tickets()
    } else {
        console.log('running load logic')
        login_form()
    }
}

main()