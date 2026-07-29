
## Overall Architecture

The overall architecture of Chisimba was created by Sean Legassick.

Sean established the architectural principles that made Chisimba a modular,
object-oriented application framework suitable for building a wide range of
web applications. The framework architecture remained remarkably stable
throughout the active life of the project.

## The Engine

The Chisimba engine was designed and developed by Paul Scott.

The engine forms the kernel of the framework and is responsible for object
creation, module loading, configuration, session management, database
connections, language support and request dispatch.

Because of its central role, changes to the engine were tightly controlled.
Only Paul edited the engine code directly. Every change required review by
another senior developer before it could be incorporated into the framework.

This discipline helped maintain the stability of the framework throughout its
active development.

## Development Process

Development followed a peer-review process for core framework components.
Changes to critical infrastructure required independent review before being
accepted.

The framework therefore evolved conservatively, with emphasis placed on
maintaining compatibility and architectural integrity.
