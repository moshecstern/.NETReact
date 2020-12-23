# .NETReact
.NET Core, React Hooks with TypeScript and MobX for state management 



CTRL + . => quick fix menu


## Seeding Data

Many ways, most efficiant;

add 'Seed.cs' to Persistance folder, 
create structure to Domain in 'Activity.cs'
call the seed in Persistance 'DataContext.cs'
command terminal 'dotnet ef migrations add "ActivityEntityUpdated" -p Persistence/ -s API/'

## CQRS

## MobX

## MediatR

## backend 
run backend only: cd API/    ==>   dotnet watch run
watch run will restart backend server every time there are changes


## TypeScript