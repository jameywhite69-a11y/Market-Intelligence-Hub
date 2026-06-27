# Persistence Layer

v22.1 adds a dependency-light JSON persistence layer.

## Files

Data is stored under:

```text
app/storage/data/
```

Stores include:

- `workspace_state.json`
- `audit_log.json`
- `orders.json`
- `positions.json`
- `strategies.json`

## Future Upgrade

The `JsonStore` abstraction is intentionally small so it can later be replaced by:

- SQLite
- PostgreSQL
- DuckDB
- Cloud storage
