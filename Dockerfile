# Use python image
FROM python:3.11.2

# Set up working directory
WORKDIR /app/backend

# Copy the requirements file
COPY requirements.txt .

# Install requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project
COPY backend ./backend

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/

# Make entrypoint.sh executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Server running command
ENTRYPOINT ["entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
