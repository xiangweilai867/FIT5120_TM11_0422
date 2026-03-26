## Core Principles

### I. Single Responsibility
Each component MUST have one and only one reason to change. Classes, modules, and functions MUST focus on a single task or responsibility.

- Domain logic MUST be separated from infrastructure concerns
- Servies MUST NOT combine multiple business capabilities
- Files MUST contain only closely related functionality

### II. Open/Closed Design
Code MUST be open for extension but closed for modification. New functionality MUST be added through new components rather than modifying existing ones. This minimizes regression risks and stabilizes existing features.

- Use interfaces/abstract classes for extension points
- Create new implementations rather than modifying existing ones
- Favor composition over inheritance

### III. Liskov Substitution
Derived classes MUST be substitutable for their base classes without altering program correctness. Interfaces MUST be honored by all implementations, with no unexpected side effects or additional requirements imposed by derived classes.

### IV. Interface Segregation
Clients MUST NOT be forced to depend on interfacces they do not use. Prefer many small, specific interfaces over large, general-purpose ones. This reduces coupling and prevents unnecessary dependency chains.

- Interfaces MUST be focused and cohesive
- Clients MUST only see methods they need
- Role-based interfaces MUST be preferred over object-based ones

### V. Dependency Inversion
High-level modules MUST NOT depend on low-level modules. Both MUST depend on abstractions. Abstractions MUST NOT depend on details; details MUST depend on abstractions.

- Use dependency injection for all services
- Program to interfaces, not implementations
- Configure dependencies at startup/composition root
