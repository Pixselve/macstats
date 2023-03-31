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
    'city': restaurant['properties']['address']['city']
} for restaurant in restaurants])

# Get Big Mac prices and add them to the DataFrame
df['big_mac_price'] = df['store_id'].apply(get_big_mac_price)
df = df.dropna(subset=['big_mac_price'])

# Calculate the average Big Mac price for each city
city_avg_prices = df.groupby('city')['big_mac_price'].mean()

# Sort cities by average Big Mac price and get the top 10
top_cities_expensive = city_avg_prices.nlargest(10)
top_cities_cheapest = city_avg_prices.nsmallest(10)

# Save the results

top_cities_expensive_list = [{"city": city, "price": price} for city, price in top_cities_expensive.items()]
top_cities_cheapest_list = [{"city": city, "price": price} for city, price in top_cities_cheapest.items()]

with open(f"{base_path_processed}/top_cities_expensive.json", "w") as f:
    json.dump(top_cities_expensive_list, f)

with open(f"{base_path_processed}/top_cities_cheapest.json", "w") as f:
    json.dump(top_cities_cheapest_list, f)

# --- Price distribution ---

# Calculate the number of restaurants for each Big Mac price
price_distribution = df['big_mac_price'].value_counts()

# Convert the Series to a list of dictionaries with the desired format
price_distribution_list = [{"price": price, "amount_of_restaurant": count} for price, count in price_distribution.items()]

# Save the price distribution as a JSON file
with open(f"{base_path_processed}/big_mac_price_distribution.json", "w") as f:
    json.dump(price_distribution_list, f, indent=4)

print("The Big Mac price distribution and the number of restaurants for each price have been saved as a JSON file.")
