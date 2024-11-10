# TestSkool
TestSkool is a quiz web app for teachers, and quiz solving platform for students.

Teachers can create quizzes for students, and students can solve prepared quizzes by teachers.

## Incomin TestStool features:

### Login and Register:
**Dedicated Login and Register pages**: To Login to system and Register a new account are located on separate pages.

### My Profile:
**Profile Management**: Users will be able to update their profiles, including profile photos, through the "My Profile" section.

- **Teacher View:** If the user is a teacher, they also will be able to display the quizzes they have created.

- **Student View:** If the user is a student, they also will be able to display all the quizzes they have completed. Additionally, there will be interactive charts to showing their performances in detail.

### Home Page:
- **Quiz Discovery**: Users will be able to browse all quizzes created by teachers in a card format.

- **Quiz Details**: Clicking on a quiz will trigger a drawer to show details about clicked quiz. There will be a close button, start button to solve quiz and a download button to download the quiz as pdf.

### Quiz Solving Page:
Students will be able to solve quizzes they view on the Home page or a teacher's profile on a dedicated quiz-solving page.

### Create Quiz Button:
Teachers will be able to create quizzes with customizable settings for quiz type, number of questions, and number of answer options. This button will be available only for teachers.

### Teachers Page:
In this teachers listing page, teachers will be appeared as cards. Any user also will be able to search for any teacher.

### Students Page:
Same as Teachers page for students. Since students cannot prepare quizzes, the quizzes they have solved and the charts showing their performance will be shown.

## Mılestones
TestSkool is designed as a project with two milestones:

**Milestone 1**: A web application for teachers to prepare quizzes and download them as PDFs. Quiz solving and performance demonstration for students.

**Milestone 2**: Social addition. Users will be able to follow each other, send messages to each other and have a live quiz solving sessions with teachers.


## Technology Stack
This project still under development. Packages will be changed / added as needs. Also this is Test Driven Development (TDD), you can check tests on actions tab.

Testskool uses Django with DRF on the back-end, and ReactJS on the front-end.

**npm packages used for React JS**:

For client side routing:
- [React Router](https://reactrouter.com/en/main)

UI library:
- [Material UI](https://mui.com/)

Fonts:
- [@fontsource/merriweather-sans](https://www.npmjs.com/package/@fontsource/merriweather-sans)
- [@fontsource/secular-one](https://www.npmjs.com/package/@fontsource/secular-one)

For linting:
- [Eslint](https://eslint.org/)

For test:
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Happy DOM](https://www.npmjs.com/package/@happy-dom/jest-environment)
- [user-event](https://www.npmjs.com/package/@testing-library/user-event)

(See **packages.json** file in ./frontend directory for details.)

*Please note that react files created with [Vite](https://vitejs.dev/).*


**python packages used for Django**:
- [Django==5.1.2](https://www.djangoproject.com/)
- [djangorestframework==3.15.2](https://www.django-rest-framework.org/)
- [python-dotenv==1.0.1](https://pypi.org/project/python-dotenv/)

(Please see **requirements.txt** file in the root directory for details.)

## Installation Guide
Do you want to run this project in your local machine?
### Installation instructions:

*Disclaimer: This project serves no purpose other than its own. The developer and the project are not liable for any material or immaterial damages that may arise before, during, or after the installation and/or use of this project.*

**Notes:**
- This instructions are written only to run in your local machine. To run in a cloud server or derivatives, you will need special configurations.
- This project developed in [Debian OS](https://www.debian.org/), and instructions will be suit for Debian OS.
- There are two methods to install and run this project. Whichever method you choose, create an ".env" file in the "./backend/backend/" directory at first. Inside the ".env" file located in "./backend/backend/" directory, write 'SECRET_KEY' = 'YourSecretKey'. Django needs a secret key to work.

./backend/backend/.env:
```
'SECRET_KEY' = 'WriteYourSecretKeyHere'
```

**Method 1- Run the project with Docker:**

This is the easiest way to run this project in your local machine.

Install [Docker and Docker Compose](https://www.docker.com/)

Download this repository anywhere in your system:
```bash
git clone https://github.com/levent-86/testskool.git
```

After you download this repository to your machine, you will see `docker-compose.yml` file in the root (testskool) directory. under `backend:` section, you will find `environment:` subsection. Specify your own username, email and password:
```yaml
  - DJANGO_SUPERUSER_USERNAME=yourUsername
  - DJANGO_SUPERUSER_EMAIL=yourEmail@example.com
  - DJANGO_SUPERUSER_PASSWORD=yourPassword
```
if you omit or consider to leave it as is, your default username, email and password will stay as;
```
username: admin
email: admin@example.com
password: 12345
```

After you specify your superuser informations or consider to omit, open a terminal in the root directory (testskool) or move your terminal into root directory:
```bash
cd testskool/
```

To containerize project;

If you installed Docker Compose as plugin:
```bash
sudo docker compose build
```
If you installed Docker Compose as stand-alone:
```bash
sudo docker-compose build
```

To run project;

If you installed Docker Compose as plugin:
```bash
sudo docker compose up
```
If you installed Docker Compose as stand-alone:
```bash
sudo docker-compose up
```
The application will be available for the local machine and other devices on the same network. Terminal will give you two links to redirect you: Local and Network. Doesn't matter which link you've clicked (http://localhost:5173/ or http://172.19.0.2:5173/).

Before you start to use the application, you need to add some teacher subjects to database. While application running in your terminal, open your web browser and visit admin site via http://localhost:8000/admin/

enter your specified username and password (if you omit to specify your username and password, your username is admin and your password is 12345). Under TESTSKOOL header, click on "Subjects" and add some teacher subjects in it (math, art, etc...)

After you add subjects, you're ready to use application. Go to http://localhost:5173/ address and use the application.

**Method 2-Run the project with manual installation:**

This is advanced way to run this project in your local machine.

Python version: 3.11.2

Node version: 20.18.0

npm version: 10.8.2

After you download this repository in your machine, open a terminal in the root directory (testskool) or move your terminal into root directory:
```bash
cd testskool/
```
Create an env folder for virtual environment creation:
```bash
python3 -m venv env
```
Now activate virtual environment:
```bash
source env/bin/activate
```
Install the dependencies:
```bash
pip install -r requirements.txt
```
Move your terminal to backend/ directory:
```bash
cd backend/
```
Make migrations for database:
```bash
python manage.py makemigrations
```
```bash
python manage.py migrate
```
Create a super user for admin panel usage:
```bash
python manage.py createsuperuser
```
After you specify admin username, email and password, you're ready to run Django server:
```bash
python manage.py runserver
```
Terminal will give you a link (http://127.0.0.1:8000/). Copy the link from terminal and paste to your web browser, and add "admin/" end of the link: `http://127.0.0.1:8000/admin/`

And now you're ready to see admin panel. Enter your Username and Password you specified on super user creation step to see panel.

The database is currently empty. Click on "Subjects" under TESTSKOOL header, and add some teacher subjects (math, art, etc...)

Django backend is ready to serve APIs for frontend. Leave the terminal as is, **DO NOT** close it. Open a new terminal in the frontend directory or move new terminal into root directory:
```bash
cd testskool/frontend/
```
Install npm dependencies:
```bash
npm install
```
After installation done, run React frontend:
```bash
npm run dev
```
Terminal will give you a link to click (http://localhost:5173/). You're ready to use application on your web browser when you click on it.

---

### Database schema:
_This database schema has been prepared based on the anticipated needs of the project. Please note that the database schema may change as the needs of the project progress._

![database-schema-png](./docs/ts-db-scheme.png)
Since User table is created out of the box by Django, some fields (like the password field) are intentionally not added to the table.

You can inspect the database on this address: [drawDB](https://drawdb.vercel.app/editor?shareId=15cd8df5886674988c0fcd728d579574)

---

### File structure:

```bash
.
├── backend
│   ├── backend
│   │   ├── asgi.py
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   └── testskool
│       ├── admin.py
│       ├── apps.py
│       ├── __init__.py
│       ├── migrations
│       │   └── __init__.py
│       ├── models.py
│       ├── serializers.py
│       ├── tests.py
│       ├── urls.py
│       └── views.py
├── docker-compose.yml
├── Dockerfile
├── docs
│   └── ts-db-scheme.png
├── entrypoint.sh
├── frontend
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── about.txt
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   └── site.webmanifest
│   ├── src
│   │   ├── App.tsx
│   │   ├── components
│   │   │   ├── navbar
│   │   │   │   └── NavbarDrawer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── CreateQuiz.tsx
│   │   │   ├── Faq.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MyProfile.tsx
│   │   │   ├── NoPage.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Students.tsx
│   │   │   └── Teachers.tsx
│   │   ├── __tests__
│   │   │   ├── Navbar.test.tsx
│   │   │   └── setupTests.ts
│   │   ├── themes
│   │   │   ├── fonts.ts
│   │   │   └── theme.ts
│   │   ├── @types
│   │   │   └── fonts.d.ts
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── vitest.config.ts
├── README.md
└── requirements.txt
```
(This structure taken via `tree` command on terminal.)

**Directory Explanations:**

**./**: Root directory. Includes docs, backend and frontend folders, files belongs to Docker, README.md and python's requirements.txt file.

**./docs/**: Inludes information materials such as database scheme about project.

**./backend/**: Django framework's main directory. Includes backend, testskool folders and manage.py files.

**./backend/backend/**: Includes Django framework's main configuration and url setting files.

**./backend/testskool/**: Includes web app's administration, migrations, models, serializers, views, urls and tests files.

**./frontend/**: React JS' main directory. Includes configuration files which are belongs to TypeScript, Vite, Vitest, Docker, Eslint, npm's package files and front-end's main index.html file. Also public and src folders inside of this directory.

**./frontend/public/**: Includes favicons in different sizes, files about them, and webmanifest files.

**./frontend/src/**: Includes web app's main front-end typescript files, folders for components, pages, themes, types and tests.

**./frontend/src/components/**: Includes Navbar.tsx component file of web app and folders about parts of the components such as navbar folder.

**./frontend/src/components/navbar/**: Includes NavbarDrawer.tsx file which is Navbar.tsx component's part.

**./frontend/src/pages/**: Includes web app's pages.

**./frontend/src/__ tests__/**: Includes test files to testing with Vitest.

**./frontend/src/themes/**: Includes theme files to customize MUI.

**./frontend/src/@types/**: Includes type declaring files for TypeScript.

November 2024

[Mustafa Levent Fidancı](https://www.linkedin.com/in/mustafaleventfidanci/)
