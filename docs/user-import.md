# User Import

Creating all users by hand can be cumbersome.
To make onboarding easier, you can import users from a `.csv` file.

## How to generate the CSV file

Each user has different properties that need to be set:

* username
* displayname
* password
* email
* role
* isAdult
* children
* graduationYear

If `password` is left blank, a password reset will be invoked for the user so they can set their password themselves.

`children` should contain a list of the usernames of that users children, separated by colons.
If the user doesn't have any children, leave the field blank.

`isAdult` needs to be set only for students; set it to `"true"` should they be adult.
If they are not adult - leave the field blank.

`graduationYear` needs to be set for students and mangers, it matches these by their expected graduation year.

`role` is one of the roles `admin`, `parent`, `student`, `manager`, `teacher`.

The first row of the csv needs to be a header row with the above properties.

A sample import file could look like this:

```csv
username,displayname,email,role,isAdult,graduationYear,children
maxmueller,Max Mueller,mmueller@gmail.com,student,TRUE,2019,
majamueller,Maja Mueller,maja@mueller.de,student,FALSE,2019,
tomtoblerone,Tom Toblerone,toblerone@your-school.com,teacher,,,
gerdmueller,Gerd Mueller,gerd@mueller.de,parent,,,maxmueller:majamueller
gabimueller,Gabi Mueller,gabi@mueller.de,parent,,,maxmueller:majamueller
bertboesreich,Bert Boesreich,boesreich@your-school.com,manager,,2019,
ralphreicht,Ralph Reicht,reicht@your-school.com,teacher,,
```

This would create the following users:

```mermaid
graph LR;

maxmueller["Max Mueller (student, is adult)"]
majamueller["Maja Mueller (student)"]
tomtoblerone["Tom Toblerone (teacher)"]
gerdmueller["Gerd Mueller (parent)"]
gabimueller["Gabi Mueller (parent)"]
bertboesreich["Bert Boesreich (manager)"]
ralphreicht["Ralph Reicht (teacher)"]

subgraph teacher
  tomtoblerone
  ralphreicht
end

gerdmueller -- child--> maxmueller
gerdmueller -- child --> majamueller
gabimueller -- child --> maxmueller
gabimueller -- child --> majamueller

bertboesreich --> maxmueller
bertboesreich --> majamueller
```

To create this `.csv` file, you can use the provided [template](https://gitlab.com/Skn0tt/EntE/raw/master/docs/assets/User%20Import%20Template.xlsx?inline=false) for Microsoft Excel.

## How to import the CSV file

Go to "Users", click on the "Create"-Button and now click on "Import" in the bottom row.
Drag'n'drop your `.csv` file into the dropzone or click on it to open a file dialog.
Click on the "Submit"-Button to invoke the import.