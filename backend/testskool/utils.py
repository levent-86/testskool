class Notification:
    def get_message(key: str):
        messages = {
            "user_created": {
                "status": "success",
                "message": "Account registered successfully. You are ready to log in!"
            },
            "profile_updated": {
                "status": "success",
                "message": "Profile updated successfully."
            },
            "account_deleted": {
                "status": "success",
                "message": "Account deleted successfully."
            },
        }

        # Return a default message if message not found
        return messages.get(key, {
            "status": "error",
            "message": "An unexpected error occurred."
        })
