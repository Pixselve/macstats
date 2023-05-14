import type { PageServerLoad } from './$types';
import top_cities_expensive from '../../../../generated/processed/top_cities_expensive.json';
import top_cities_cheapest from '../../../../generated/processed/top_cities_cheapest.json';
import big_mac_price_distribution from '../../../../generated/processed/big_mac_price_distribution.json';
import big_mac_price_med14 from '../../../../generated/processed/bigmac_price_med14.json';
import number_of_competitors_to_price from '../../../../generated/processed/number_of_competitors_to_price.json';
import regression from 'regression';

export const load = (async ({ params }) => {
  const sortedDistribution = big_mac_price_distribution.sort((a, b) => a.price - b.price);

  const big_mac_price_med14_processed = big_mac_price_med14.map((d) => ({
    x: d.MED14,
    y: d.big_mac_price
  }));

  // regression for bigmac price med14
  const result = regression.linear(
    big_mac_price_med14_processed.map((d) => [d.x, d.y]),
    { precision: 4 }
  );

  // regression for number of competitors to price
  const competitorsRegression = regression.linear(
    number_of_competitors_to_price.map((d) => [d.number_of_competitors, d.big_mac_price]),
    { precision: 1 }
  );

  return {
    top_cities_expensive,
    top_cities_cheapest,
    big_mac_price_distribution: {
      prices: sortedDistribution.map((d) => d.price),
      amounts_of_restaurant: sortedDistribution.map((d) => d.amount_of_restaurant)
    },
    standardOfLiving: {
      prices: big_mac_price_med14_processed,
      trendline: generateTrendlinePoints(
        result.equation[0],
        result.equation[1],
        Math.min(...big_mac_price_med14_processed.map((d) => d.x)),
        Math.max(...big_mac_price_med14_processed.map((d) => d.x))
      ),
      r2: result.r2
    },
    competitors: {
      number_of_competitors_to_price: number_of_competitors_to_price.map((d) => ({
        y: d.big_mac_price,
        x: d.number_of_competitors
      })),
      trendline: generateTrendlinePoints(
        competitorsRegression.equation[0],
        competitorsRegression.equation[1],
        Math.min(...number_of_competitors_to_price.map((d) => d.number_of_competitors)),
        Math.max(...number_of_competitors_to_price.map((d) => d.number_of_competitors))
      ),
      r2: competitorsRegression.r2
    }
  };
}) satisfies PageServerLoad;

function generateTrendlinePoints(
  slope: number,
  intercept: number,
  minX: number,
  maxX: number,
  numPoints = 100
) {
  const stepSize = (maxX - minX) / (numPoints - 1);
  const trendlinePoints = [];

  for (let i = 0; i < numPoints; i++) {
    const x = minX + stepSize * i;
    const y = slope * x + intercept;
    trendlinePoints.push({ x, y });
  }

  return trendlinePoints;
}
