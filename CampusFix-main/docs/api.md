# API Documentation

Base URL: `/api`. All protected routes require `Authorization: Bearer <token>`.

## Auth
| Method | Path | Access | Description |
|---|---|---|---|
| POST | /auth/register | Public | Register a new USER account |
| POST | /auth/login | Public | Log in, returns JWT |
| POST | /auth/logout | Public | Stateless logout (client discards token) |
| GET | /auth/me | Authenticated | Current user profile |

## Tickets
| Method | Path | Access | Description |
|---|---|---|---|
| GET | /tickets | ADMIN, STAFF | List all tickets (filter + paginate) |
| POST | /tickets | Authenticated | Create a ticket (multipart, `attachments[]`) |
| GET | /tickets/my | Authenticated | Own tickets |
| GET | /tickets/assigned | STAFF, ADMIN | Tickets assigned to the caller |
| GET | /tickets/:id | Owner, assignee, ADMIN/STAFF | Ticket detail |
| PUT | /tickets/:id | Owner (while OPEN) or ADMIN | Edit title/description/location/category |
| DELETE | /tickets/:id | Owner or ADMIN | Cancel a ticket |
| PUT | /tickets/:id/assign | ADMIN | Assign to a STAFF user |
| PUT | /tickets/:id/status | ADMIN, assigned STAFF | Change status (validated transitions only) |
| PUT | /tickets/:id/priority | ADMIN | Change priority |
| PUT | /tickets/:id/resolve | ADMIN, assigned STAFF | Mark resolved with notes + resolution images |

Query params on list endpoints: `page`, `limit`, `status`, `priority`, `category`, `location`, `assignedTo`, `search`.

## Comments
| Method | Path | Access |
|---|---|---|
| GET | /tickets/:id/comments | Owner, assignee, ADMIN/STAFF |
| POST | /tickets/:id/comments | Owner, assignee, ADMIN/STAFF |

## Categories
| Method | Path | Access |
|---|---|---|
| GET | /categories | Authenticated (active only for non-admins) |
| POST | /categories | ADMIN |
| PUT | /categories/:id | ADMIN |
| DELETE | /categories/:id | ADMIN (soft delete / deactivate) |

## Notifications
| Method | Path | Access |
|---|---|---|
| GET | /notifications | Authenticated |
| PUT | /notifications/:id/read | Authenticated |
| PUT | /notifications/read-all | Authenticated |

## Dashboard
| Method | Path | Access |
|---|---|---|
| GET | /dashboard/user | Authenticated |
| GET | /dashboard/staff | STAFF, ADMIN |
| GET | /dashboard/admin | ADMIN |

## Users (admin)
| Method | Path | Access |
|---|---|---|
| GET | /users?role=STAFF | ADMIN |
| PUT | /users/:id/role | ADMIN |
| PUT | /users/:id/status | ADMIN |

## Health
| Method | Path | Access |
|---|---|---|
| GET | /health | Public |

All error responses follow: `{ "success": false, "message": "..." }` with standard HTTP status codes (400, 401, 403, 404, 409, 413, 500).
