namespace gps {
    let lat = 0
    let long = 0
    let results: string[] = []

    /**
     * Get position longitude.
     */
    //% blockId=gps block="gps get longitude"
    //% weight=1
    export function longitude(): number {
        long = parseInt(results[5])
        long = (long / 1000000.0)
        return long
    }

    /**
    * Get position latitude.
    */
    //% blockId=gps block="gps get latitude"
    //% weight=1
    export function latitude(): number {
        lat = parseInt(results[3])
        lat = (lat / 1000000.0)
        return lat
    }

    /**
    * Get encode.
    */
    //% blockId=gps block="gps encode"
    //% weight=1
    export function encode(): void {
        let valid_sentence = serial.readLine(serial.delimiters(Delimiters.NewLine))
        let ind = valid_sentence.indexOf(",")

        while (ind != -1) {
            results.push(valid_sentence.slice(0, ind))
            valid_sentence = valid_sentence.slice(ind + 1)
            ind = valid_sentence.indexOf(",")
        }
        results.push(valid_sentence)
    }

}
