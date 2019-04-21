---
title: User Management
---

# User Management

Users can only be managed by administrators.
A list of all users of the instance can be seen at the "Users" page that can be reached using the navigation bar.

You can click on one of the users in the table in order to open a mask that enables you to edit the properties of a user account.
Through a click on the "+"-Button on the lower right, you can create a new user.

There is a [mass-import feature](./user-import/user-import-from-csv.md) that can be useful at the start of a term when a lot of new users need to be imported.

## Roles

These properties are saved about every user:

- Benutzername (z.b. `max.mustermann`)
- Anzeigename (z.b. `Max Mustermann`)
- E-Mail-Addresse (z.b. `max@mustermann.de`)

Additionally, every user takes on one the following roles:

### Student

Students can create new entries.

In addition to the above, the following properties are saved:

- birthday (so that entries adult students do not require signature of their parents)
- graduation year (so corresponding managers can be determined)

### Parent

Parents can sign entries of their corresponding students so they can be accepted (if the student is adult, this step is not omitted).
Additionally, parents can create new entries in the name of their corresponding students.

In addition to the above mentioned properties, their corresponding students are saved.

### Teacher

Teachers are able to see which students missed their classes in order to update their own records.
When creating a new entry, teachers can be selected for missed classes.

### Manager

A manager can - just as a teacher - be mentioned as the teacher of a missed class.

Additionally, managers can view the entries of the students they manage in order to review and sign them.
Managers can access statistics on their students and their entries.

In addition to the above mentioned properties, the graduation year of their corresponding students is saved.

### Administrator

An administrator can view all entries, missed classes and statistics about students.
He is not able to create new entries or sign them.
This role allows configuring EntE and user management.
