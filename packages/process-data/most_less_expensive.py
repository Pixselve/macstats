import json
import os

import numpy as np
import pandas as pd

base_path_generated = "../../generated"
base_path_processed = "../../generated/processed"

# Load the data
restaurants_path = f"{base_path_generated}/restaurants.json"

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
restaurantData = pd.DataFrame([{
    'store_id': restaurant['properties']['store_id'],
    'city': restaurant['properties']['address']['city'],
    'x': restaurant['properties']['user_properties']['x'],
    'y': restaurant['properties']['user_properties']['y'],
} for restaurant in restaurants])

# Get Big Mac prices and add them to the DataFrame
restaurantData['big_mac_price'] = restaurantData['store_id'].apply(get_big_mac_price)
restaurantData = restaurantData.dropna(subset=['big_mac_price'])

# Calculate the average Big Mac price for each city
city_avg_prices = restaurantData.groupby('city')['big_mac_price'].mean()

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
price_distribution = restaurantData['big_mac_price'].value_counts()

# Convert the Series to a list of dictionaries with the desired format
price_distribution_list = [{"price": price, "amount_of_restaurant": count} for price, count in price_distribution.items()]

# Save the price distribution as a JSON file
with open(f"{base_path_processed}/big_mac_price_distribution.json", "w") as f:
    json.dump(price_distribution_list, f, indent=4)

print("The Big Mac price distribution and the number of restaurants for each price have been saved as a JSON file.")

# --- Competitors ---

competitors_path = f"{base_path_generated}/restaurants-concurrence.json"

# Load the competitors data
with open(competitors_path, 'r') as f:
    competitors = json.load(f)

# competitors = [{store_id: 1, number_concurrents: 2}, {store_id: 2, number_concurrents: 3}]
# Create a DataFrame from the competitors data
competitor_to_restaurants = pd.DataFrame([{
    'store_id': competitor['store_id'],
    'number_of_competitors': competitor['number_concurrents']
} for competitor in competitors])

# add restaurant data to the DataFrame
competitor_to_restaurants = competitor_to_restaurants.merge(restaurantData, on='store_id')

# first json : {number_concurrents: number, big_mac_price: number}[]
# do not group by. I want to make a scatter plot
number_of_competitors_to_price = competitor_to_restaurants[['number_of_competitors', 'big_mac_price']].to_dict('records')

with open(f"{base_path_processed}/number_of_competitors_to_price.json", "w") as f:
    json.dump(number_of_competitors_to_price, f, indent=4)

import matplotlib.pyplot as plt
import seaborn as sns

# Create a scatterplot with a regression line using seaborn
sns.regplot(data=competitor_to_restaurants, x='number_of_competitors', y='big_mac_price', scatter_kws={'alpha': 0.5}, line_kws={'color': 'red'})

# Customize the plot
plt.title('Big Mac Price vs. Number of Competitors')
plt.xlabel('Number of Competitors')
plt.ylabel('Big Mac Price')

# Show the plot
plt.show()

# calculate the regression line
X = competitor_to_restaurants['number_of_competitors']
Y = competitor_to_restaurants['big_mac_price']
m, b = np.polyfit(X, Y, 1)

# calculate the mean squared error
mean_squared_error = np.square(np.subtract(Y, m * X + b)).mean()

print(f"The equation of the regression line is y = {m:.4f}x + {b:.4f} and the mean squared error is {mean_squared_error:.2f}.")
