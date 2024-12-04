class Notification:
    """ Notifications to send """

    raw_messages = {
        # Success Messages
        "user_created": "Account registered successfully. You are ready to log in!",

        # Missing fields (user input required)
        "missing_username": "Please provide a username.",
        "missing_password": "Please provide a password.",
        "missing_role": "Choose one field: student or teacher.",
        "missing_subject": "Please select your subject(s) (ex: \"Math\", \"Art\" ...).",

        # Validation Messages
        "short_password": "Password must be at least 8 characters.",
        "password_mismatch": "Password and confirmation didn't match.",
        "space_not_allowed": "Space is not allowed on username.",
        "only_teachers": "Only teachers can choose a subject.",

        # Error Messages
        "username_exists": "This username is already exists.",
        "unable_register": "Unable to create user.",
    }

    # Add key/value pair to each notification message
    messages = {key: {"message": value} for key, value in raw_messages.items()}

    # Return unknown notification message if choosen message isn't exists
    @classmethod
    def get_message(cls, key: str):
        return cls.messages.get(key, {"message": "Unknown notification."})
