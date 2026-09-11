# MongoDB Data Model

```mermaid
erDiagram
    USER ||--o{ TICKET : creates
    USER ||--o{ TICKET : "assigned to"
    CATEGORY ||--o{ TICKET : categorizes
    TICKET ||--o{ COMMENT : has
    TICKET ||--o{ NOTIFICATION : triggers
    USER ||--o{ COMMENT : writes
    USER ||--o{ NOTIFICATION : receives

    USER {
        string name
        string email
        string password
        string role
        string department
        string phone
        boolean isActive
    }
    CATEGORY {
        string name
        string description
        string icon
        boolean isActive
    }
    TICKET {
        string ticketId
        string title
        string description
        ObjectId category
        string location
        string priority
        string status
        ObjectId createdBy
        ObjectId assignedTo
        array attachments
        string resolutionNotes
        array resolutionImages
        date resolvedAt
        date closedAt
    }
    COMMENT {
        ObjectId ticket
        ObjectId user
        string message
    }
    NOTIFICATION {
        ObjectId recipient
        ObjectId ticket
        string title
        string message
        string type
        boolean isRead
    }
```

## Notes

- `ticketId` (e.g. `CFX-2026-0001`) is generated atomically via a per-year `Counter` document, avoiding collisions under concurrent ticket creation.
- Indexes: `Ticket.status`, `Ticket.createdBy`, `Ticket.assignedTo`, `Ticket.createdAt`, plus a text index across `title`/`description`/`ticketId` for search.
- Passwords are bcrypt-hashed in a `pre('save')` hook and stripped from `toJSON()` output.
