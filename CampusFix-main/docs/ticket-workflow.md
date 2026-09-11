# Ticket Lifecycle

```mermaid
stateDiagram-v2
    [*] --> OPEN
    OPEN --> ASSIGNED
    OPEN --> CANCELLED
    ASSIGNED --> IN_PROGRESS
    ASSIGNED --> CANCELLED
    IN_PROGRESS --> RESOLVED
    IN_PROGRESS --> ASSIGNED
    RESOLVED --> CLOSED
    RESOLVED --> IN_PROGRESS
    CLOSED --> [*]
    CANCELLED --> [*]
```

Transitions are enforced in `Ticket.canTransition(from, to)` (`server/src/models/Ticket.js`) and checked again inside `ticketController.changeStatus` / `resolveTicket` before any write — the frontend's dropdown options are a convenience, not the source of truth. An invalid request (e.g. `CLOSED → OPEN`) returns `409 Conflict`.
