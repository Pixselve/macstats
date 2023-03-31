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


with open(restaurants_path, 'r') as f:
    restaurants_data = json.load(f)

with open(restaurants_concurrence_path, 'r') as f:
    restaurants_concurrence_data = json.load(f)

# Convert the data to DataFrames
# restaurants_df = pd.json_normalize(restaurants_data).rename(columns={"properties.store_id": "store_id"})
# concurrence_df = pd.DataFrame(restaurants_concurrence_data)

# # Merge the DataFrames
# merged_df = restaurants_df.merge(concurrence_df, on='store_id')
#
# # Add Big Mac prices
# merged_df['big_mac_price'] = merged_df['store_id'].apply(get_big_mac_price)
#
# # Filter out rows with NaN Big Mac prices
# filtered_df = merged_df.dropna(subset=['big_mac_price'])
#
# # Find the maximum number of concurrents
# max_concurrents = filtered_df['number_concurrents'].max()
#
# # Find the min and max price of Big Macs
# min_big_mac_price = filtered_df['big_mac_price'].min()
# max_big_mac_price = filtered_df['big_mac_price'].max()
#
# # Create separate latitude and longitude columns
# filtered_df['latitude'] = filtered_df['geometry.coordinates'].apply(lambda x: x[1])
# filtered_df['longitude'] = filtered_df['geometry.coordinates'].apply(lambda x: x[0])

# # Create the 'geometry' column
# filtered_df['geometry'] = filtered_df.apply(lambda row: Point(row['longitude'], row['latitude']), axis=1)
#
#
# # Select only necessary columns
# necessary_columns = ['store_id', 'number_concurrents', 'big_mac_price', 'latitude', 'longitude', 'geometry']
# filtered_df = filtered_df[necessary_columns]
#
# # Convert the DataFrame to a GeoDataFrame
# filtered_gdf = gpd.GeoDataFrame(filtered_df, geometry='geometry')
#
# filtered_gdf.to_file("filtered_data.geojson", driver='GeoJSON')


import os
import json
from collections import defaultdict
import pandas as pd


def get_top_10_cities_expensive_big_mac(restaurants_path):
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
    top_10_cities = city_avg_prices.nlargest(10)

    # Convert the Series to a list of dictionaries with the desired format
    top_10_cities_list = [{"city": city, "price": price} for city, price in top_10_cities.items()]

    return top_10_cities_list

# Call the function with the restaurants path
top_5_cities = get_top_10_cities_expensive_big_mac(restaurants_path)

# Save the top 5 cities and their mean prices as a JSON file
with open(f"{base_path_processed}/top_cities_expensive.json", "w") as f:
    json.dump(top_5_cities, f, indent=4)
