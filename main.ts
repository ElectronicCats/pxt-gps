namespace gps {
    let latitude = 0
    let longitude = 0
    let results: string[] = []

    /**
     * Get position latitude and longitude.
     */
    //% blockId=gps block="gps get position"
    //% weight=1
    export function get_position(): void {
        latitude = (latitude / 1000000.0);
        longitude = (longitude / 1000000.0);
    }

    function encode(): void {
        let valid_sentence = serial.readLine()
        let ind = valid_sentence.indexOf(",")

        while (ind != -1) {
            results.push(valid_sentence.slice(0, ind))
            valid_sentence = valid_sentence.slice(ind + 1)
            ind = valid_sentence.indexOf(",")
        }
        results.push(valid_sentence)
        helpers.arrayForEach(results, function (value: string, index: number) {
            console.log(value)
        })
    }

}
