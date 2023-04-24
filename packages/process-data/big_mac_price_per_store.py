import json
import os

import pandas as pd

base_path_generated = "../../generated"
base_path_processed = "../../generated/processed"

# Load the data
restaurants_path = f"{base_path_generated}/restaurants.json"
restaurants_concurrence_path = f"{base_path_generated}/restaurants-concurrence.json"

def get_big_mac_price(store_id):
    file_path = f"{base_path_generated}/burgers/{store_id}.json"
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            burger_data = json.load(f)
        for item in burger_data:
            if item["ref"] == "2040":
                return item["price"] / 100
    return None


# Load the restaurants data
with open(restaurants_path, 'r') as f:
    restaurants = json.load(f)

# Create a DataFrame from the restaurants data
df = pd.DataFrame([{
    'store_id': restaurant['properties']['store_id'],
} for restaurant in restaurants])

df['big_mac_price'] = df['store_id'].apply(get_big_mac_price)
df = df.dropna(subset=['big_mac_price'])

# save the results
df.to_csv(f"{base_path_processed}/big_mac_prices.csv", index=False)
