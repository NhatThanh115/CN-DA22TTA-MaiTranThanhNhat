#!/bin/bash

# Start SQL Server in background
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to start..."
for i in {1..50}; do
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "SQL Server is ready!"
        break
    fi
    echo "Attempt $i: SQL Server not ready yet..."
    sleep 2
done

# Check if database exists
echo "Checking if database 'tvenglish' exists..."
DB_EXISTS=$(/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -Q "SET NOCOUNT ON; SELECT name FROM sys.databases WHERE name = 'tvenglish'" -h -1 -W 2>/dev/null | tr -d '[:space:]')

if [ "$DB_EXISTS" != "tvenglish" ]; then
    echo "Database 'tvenglish' not found. Creating and initializing..."
    
    # Run the schema script
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -i /docker-entrypoint-initdb.d/schema.sql
    
    if [ $? -eq 0 ]; then
        echo "Database schema initialized successfully!"
        
        # Run the seed script
        echo "Seeding initial users..."
        /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d tvenglish -i /docker-entrypoint-initdb.d/seed.sql
        
        if [ $? -eq 0 ]; then
            echo "Users seeded successfully!"
        else
            echo "Error seeding users!"
        fi
    else
        echo "Error initializing database schema!"
    fi
else
    echo "Database 'tvenglish' already exists. Skipping initialization."
fi

# Keep container running by waiting on sqlservr
wait
