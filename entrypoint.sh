#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# Create .env file in backend folder
if [ ! -f /app/backend/backend/.env ]; then
    echo "SECRET_KEY=some-secret-key" > /app/backend/backend/.env
    echo "Created .env file with SECRET_KEY"
else
    echo ".env file already exists"
fi

# Run makemigrations and migrate commands
python manage.py makemigrations
python manage.py migrate

# Ensure if all informations are provided
if [ -z "$DJANGO_SUPERUSER_USERNAME" ] || [ -z "$DJANGO_SUPERUSER_EMAIL" ] || [ -z "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Superuser informations missing!"
    exit 1
fi

# Check if the superuser already exists
if python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print(User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists())" | grep -q True; then
    echo "Superuser already exists. Skipping superuser creation."
    echo "Your admin page login credentials:"
    echo "Username: $DJANGO_SUPERUSER_USERNAME"
    echo "Password: $DJANGO_SUPERUSER_PASSWORD"
    echo "Admin site: http://localhost:8000/admin/"
    echo "(Note: If you omit to specify your username and password fields in docker-compose.yml file, your default username is admin and your default password is 12345)"
    echo "After you enter subjects via admin site, check the 'Local' and 'Network' links above to view the TestSkool web app."
    echo "TestSkool web app by Mustafa Levent Fidanci"
    echo "Linkedin: https://www.linkedin.com/in/mustafaleventfidanci/"
    echo "Github: https://github.com/levent-86"
else
    # Create superuser
    echo "Superuser creating..."
    echo "$DJANGO_SUPERUSER_PASSWORD" | python manage.py createsuperuser --noinput \
        --username "$DJANGO_SUPERUSER_USERNAME" \
        --email "$DJANGO_SUPERUSER_EMAIL"
    echo "Your admin page login credentials:"
    echo "Username: $DJANGO_SUPERUSER_USERNAME"
    echo "Password: $DJANGO_SUPERUSER_PASSWORD"
    echo "Admin site: http://localhost:8000/admin/"
    echo "Database is currently empty. Please enter subjects (math, art, ...) in admin site to better TestSkool experience."
    echo "After you enter subjects via admin site, check the 'Local' and 'Network' links above to view the TestSkool web app."
    echo "TestSkool web app by Mustafa Levent Fidanci"
    echo "Linkedin: https://www.linkedin.com/in/mustafaleventfidanci/"
    echo "Github: https://github.com/levent-86"
fi

# Start Django server
exec "$@"

