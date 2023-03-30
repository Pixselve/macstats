import * as process from "process";
import * as path from "path";
import {RestaurantFetcherConcurrence} from "./RestaurantFetcherConcurrence";

(async () => {
    let args = process.argv.slice(2)
    if(args.length != 2) {
        console.error("Wrong number of arguments")
        console.log(showHelp())
        return
    }

    let input_file = args[0]
    let output_file = args[0]

    console.log("Starting concurrence fetcher")
    let restaurants = RestaurantFetcherConcurrence.openFile(input_file)
    let concurrence = await RestaurantFetcherConcurrence.addConcurrence(restaurants)
    RestaurantFetcherConcurrence.saveFile(output_file, concurrence)
    console.log("Done.")
})()

function showHelp(): string{
    let program = path.basename(process.argv[1])
    return `Usage : ${program} [input_file.json] [output_file.json]`
}