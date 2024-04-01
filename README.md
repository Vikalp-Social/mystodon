# Mastodon API Services Documentation

## Introduction
The Mastodon API provides a set of endpoints for interacting with the Mastodon social media platform. This documentation outlines the available services and their usage.

## Authentication
All requests to the Mastodon API require authentication using OAuth 2.0. Clients must obtain an access token by completing the OAuth 2.0 authentication flow.

## Endpoints

### Public Timelines
- **Endpoint**: `/api/v1/timelines/public`
- **Method**: GET
- **Description**: Retrieves the public timeline, which includes public posts from users on the Mastodon instance.
- **Authentication**: Not required.

### Home Timeline
- **Endpoint:** `/api/v1/timelines/home`
- **Method:** GET
- **Description:** Retrieves the home timeline for the authenticated user, including posts from users they follow.
- **Authentication:** Required.

### Post a Status
- **Endpoint**: `/api/v1/statuses`
- **Method**: POST
- **Description**: Creates a new status (i.e., a post) on the user's timeline.
- **Parameters**:
  - `status` (required): The content of the status.
- **Authentication**: Required.

### Follow a User
- **Endpoint**: `/api/v1/accounts/{account_id}/follow`
- **Method**: POST
- **Description**: Follows the specified user.
- **Parameters**:
  - `account_id` (required): ID of the user to follow.
- **Authentication**: Required.

### Get User Profile
- **Endpoint**: `/api/v1/accounts/{account_id}`
- **Method**: GET
- **Description**: Retrieves the profile information of the specified user.
- **Parameters**:
  - `account_id` (required): ID of the user whose profile to retrieve.
- **Authentication**: Required.

## Example
```python
import requests

# Example: Fetch public timeline
response = requests.get('https://mastodon.example.com/api/v1/timelines/public')
if response.status_code == 200:
    timeline_data = response.json()
    print(timeline_data)
else:
    print("Error:", response.text)
