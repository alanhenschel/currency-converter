# THOUGHTS.md

## Technical Decisions and Observations

### Project Structure
- The project follows Domain-Driven Design (DDD) principles, organizing code into distinct layers: domain, application, infrastructure, and presentation.
- Clean Architecture is implemented to ensure separation of concerns, making the application easier to maintain and test.

### Domain Layer
- The domain layer contains the core business logic, represented by models (Currency and Transaction) and services (ConversionService and TransactionService).
- Repositories are defined as interfaces, promoting the Dependency Inversion Principle and allowing for easier testing and swapping of implementations.

### Application Layer
- The API layer is structured with routers for handling specific functionalities (conversion and transactions), promoting modularity and clarity.
- Middleware is utilized for cross-cutting concerns such as logging and exception handling, ensuring a clean separation from business logic.

### Infrastructure Layer
- The infrastructure layer handles external dependencies, such as database interactions and external API calls, encapsulating these concerns away from the core business logic.
- SQLAlchemy is used for ORM, providing a robust way to interact with the database while maintaining the flexibility of the domain models.

### Testing Strategy
- Unit tests are implemented for both API endpoints and domain services, ensuring that each component behaves as expected.
- Integration tests are planned for external API interactions to validate the overall system behavior.

### Logging and Monitoring
- Structured logging is set up to facilitate better monitoring and debugging, potentially using libraries like loguru or structlog.
- Exception handling is centralized in middleware to provide consistent error responses across the application.

### Future Considerations
- Consider implementing CI/CD pipelines using GitHub Actions to automate testing and deployment processes.
- Explore the possibility of adding more features, such as user authentication and authorization, to enhance the application’s functionality.

### Conclusion
- The architecture is designed to be scalable and maintainable, adhering to best practices in software development.
- Continuous improvement and refactoring will be essential as the project evolves and new requirements emerge.