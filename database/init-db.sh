#!/bin/bash

# Wait for SQL Server to start
echo "Waiting for SQL Server to start..."
sleep 30

# Check if database exists
DB_EXISTS=$(/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -Q "SELECT name FROM sys.databases WHERE name = 'tvenglish'" -h -1 -W 2>/dev/null | tr -d '[:space:]')

if [ "$DB_EXISTS" != "tvenglish" ]; then
    echo "Database 'tvenglish' not found. Creating..."
    
    # Run the schema script
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -i /docker-entrypoint-initdb.d/schema.sql
    
    if [ $? -eq 0 ]; then
        echo "Database initialized successfully!"
    else
        echo "Error initializing database!"
        exit 1
    fi
else
    echo "Database 'tvenglish' already exists. Skipping initialization."
fi
