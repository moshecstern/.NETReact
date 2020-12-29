# .NETReact
.NET Core, React Hooks with TypeScript and MobX for state management 

To Seed, delete db and start project

CTRL + . => quick fix menu


## Seeding Data

Many ways, most efficiant;

add 'Seed.cs' to Persistance folder, 
create structure to Domain in 'Activity.cs'
call the seed in Persistance 'DataContext.cs'
command terminal 'dotnet ef migrations add "ActivityEntityUpdated" -p Persistence/ -s API/'
Drop DB: dotnet ef database drop -p Persistence/ -s API/
to make new, run from api folder dotnet watch run

## CQRS
/Application/{API/RouteName}/{Create/edit} : Like models but with middleware
handles all the controllers abilities- formats the request for specification

API/Controllers/{RouteName}Controller 
handles where to send the requests => Application

## MediatR
Thin API Controllers

## MobX
MobX Developer Tools (Google Chrome)/ terrible at the moment

## backend 
run backend only: cd API/    ==>   dotnet watch run
watch run will restart backend server every time there are changes


## TypeScript