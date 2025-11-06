import sys
import requests


def initialize_client():
    """Initialize Cloudflare API client with environment variables."""
    api_token = "e_LzOfPf9B3NJtL7mxKZ_eeAbhO8yOf3srmSttek"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json",
    }
    return headers


def get_zone_id(headers, domain):
    """Fetch zone ID for a given domain."""
    url = f"https://api.cloudflare.com/client/v4/zones?name={domain}"
    try:
        response = requests.get(url, headers=headers)
        response_data = response.json()
        if response.status_code == 200 and response_data.get("success"):
            zones = response_data.get("result", [])
            if zones:
                return zones[0]["id"]
        print(f"Error: No zones found for domain: {domain}")
    except requests.RequestException as e:
        print(f"Error making API request: {e}")
    return None


def purge_cache(headers, zone_id, domain):
    """Purge cache for a given zone ID."""
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache"
    payload = {"purge_everything": True}
    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()
        if response.status_code == 200 and response_data.get("success"):
            print(f"Successfully purged cache for {domain}")
            return True
        print(f"Error purging cache: {response_data.get('errors', 'Unknown error')}")
    except requests.RequestException as e:
        print(f"Error making purge request: {e}")
    return False


def main():
    domains = ["ryangerardwilson.com"]

    print(f"Processing {len(domains)} domain{'s' if len(domains) != 1 else ''}")

    # Initialize API client
    headers = initialize_client()

    success = True

    # Process each domain
    for domain in domains:
        zone_id = get_zone_id(headers, domain)
        if zone_id:
            if not purge_cache(headers, zone_id, domain):
                success = False
        else:
            print(f"Skipping cache purge for {domain} due to zone ID failure")
            success = False

    print(
        f"Cache purge process completed for {len(domains)} domain{'s' if len(domains) != 1 else ''}"
    )

    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
