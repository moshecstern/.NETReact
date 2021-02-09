# .NETReact
.NET Core with Identity & JWT for Authentication, React Hooks with TypeScript and MobX for state management 
Cloudinary for Image uploads, transformations, ect.


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

### Cloudinary
Image Uploads

### React DropZone
Drag and drop images for upload

### React Cropper
To resize image to perfection before upload

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
User & Role Manager
Salt & Hash (Secure) Passwords

### JWT Tokens for authentication
Infrastructure folder add Jwt=> System.IdentityModel.Token.Jwt
jtw.io => postman for jwt

Api folder add Microsoft.AspNetCore.Authentication.JwtBearer


#### Asp Net Core
Authentication/ infrustructure 

#### Entity
Design and Security

#### Fluent Validation (AspCoreNet)
Security/ Validation

#### Auto Mapper 

#### MediatR
Thin API Controllers => Dependency Injection
Application Folder

#### Sqlite
for light configuration for database

#### config
User Secrets 'dotnet user-secrets': Dev Only
init, clear, list, remove, set
dotnet user-secrets init: DEV in APi folder
dotnet user-secrets set "TokenKey" "Super Secret Key"

### API Folder
the "Server"
Controls the application
/API/Startup.cs => Server
dotnet watch run from here in dev

##### API Controllers

API/Controllers/{RouteName}Controller 
handles where to send the requests => Application


### Application Folder
Business Logic

#### Auto Mapper 

##### API Handlers 
Activities, Errors, User
Fluent Validation (AspCoreNet) => Security/ Validation

### Domain

#### Identity (AspCoreNet)

### Persistance 
DataBase Logic
Takes care of context, seeds, data for application 

Sqlite => for light configuration for database (To Start)

Entity

Config

Proxies

#### Seeding Data

To Seed, delete db and start project

(Many ways, most efficiant;)
add 'Seed.cs' to Persistance folder, 
create structure to Domain in 'Activity.cs'
call the seed in Persistance 'DataContext.cs'
command terminal 'dotnet ef migrations add "'update-name'" -p Persistence/ -s API/'
Drop DB: dotnet ef database drop -p Persistence/ -s API/
to make new, run from api folder dotnet watch run

### Infrustructure Folder
For anything needed across all backend folders or dont fit
Security JWT

#### adding folder to project & sln
Step 1: creates new class library to work from in main folder
'dotnet new classlib -n Infrastructure'
step 2: adding to projects sln
'dotnet sln add Infrastructure/'
step 3: add dependencies 
'cd Infrastructure/', 'dotnet add reference ../Application/'
step 4: finish setting up dependencies
'cd ..' , 'cd API/' , 'dotnet add reference ../Infrastructure/'
step 5: Restore project to maintain consistancy
'dotnet restore'
<!-- create inferphase and classes so we can use in project -->

### CQRS
/Application/{API/RouteName}/{Create/edit} : Like models but with middleware
handles all the controllers abilities- formats the request for specification

API/Controllers/{RouteName}Controller 
handles where to send the requests => Application


### adding env var to dotnet
in api folder, ' dotnet user-secrets set "varName" "varValue" '
dotnet user-secrets list      , (to view all user secrets in specified location)

### Cloudinary
For photo uploads

set catagery within env in api folder using ':' before variable name
cd API/  ,  dotnet user-secrets set "Cloudinary:CloudName" "varValue"
            dotnet user-secrets set "Cloudinary:ApiKey" "varValue"
            dotnet user-secrets set "Cloudinary:ApiSecret" "varValue"

            dotnet user-secrets list      , (to view all user secrets in specified location)


publishing to azure

SQL Server

delete wwwroot,
create backend release of frontend; dotnet build
Make sure to run: cd client-app/, 'npm run build'
then 

Delete publish folder in API/
dotnet publish -c Release -o API/publish --self-contained false .NETReact.sln



