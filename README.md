# .NETReact
.NET Core with Identity & JWT for Authentication, React Hooks with TypeScript and MobX for state management 


## Frontend Packages

### React TypeScript


### Semantic UI
New framework for styling

### MobX
State Management 
MobX Developer Tools (Google Chrome)/ terrible at the moment

### Axios
For api on frontend

### React Router Dom
Standard Routing

### date-fns & React-Widgets
for nice date and time picker

### Revalidate
Client side error handling

### Final Form
New form control

### React Toastify
For nice user messages

### uuid
safe access and control of user data



## backend 
CTRL + . => quick fix menu

## Backend Packages

### Identity & Asp Net CORE 
ASPNetCoreIdentity & UI
JWT Tokens for authentication
User & Role Manager
Salt & Hash (Secure) Passwords


#### Asp Net Core
Authentication

#### Entity
Design and Security

### Application Folder

#### MediatR
Thin API Controllers => Dependency Injection
Application Folder

#### Fluent Validation (AspCoreNet)
Security/ Validation

### Domain

#### Identity (AspCoreNet)

### Persistance 

#### Entity

#### Sqlite
for light configuration for database

#### Config


### API Folder
/API/Startup.cs => Server
dotnet watch run from here in dev

##### API Controllers

API/Controllers/{RouteName}Controller 
handles where to send the requests => Application

### Seeding Data

To Seed, delete db and start project

Many ways, most efficiant;

add 'Seed.cs' to Persistance folder, 
create structure to Domain in 'Activity.cs'
call the seed in Persistance 'DataContext.cs'
command terminal 'dotnet ef migrations add "'update-name'" -p Persistence/ -s API/'
Drop DB: dotnet ef database drop -p Persistence/ -s API/
to make new, run from api folder dotnet watch run


### CQRS
/Application/{API/RouteName}/{Create/edit} : Like models but with middleware
handles all the controllers abilities- formats the request for specification

API/Controllers/{RouteName}Controller 
handles where to send the requests => Application




