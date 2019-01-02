namespace gps {
    let lat = 0
    let long = 0
    let results: string[] = []
    let valid_sentence = false
    let NMEAdata: string = ""; // another iframe could write to this

    /**
    * Get encode.
    */
    //% blockId=gpsencode block="gps encode"
    //% weight=1
    export function encode() {
        NMEAdata = serial.readLine(serial.delimiters(Delimiters.NewLine))
        results = NMEAdata.split(",")
        if ((results[2].compare("A")) == 1) {
            valid_sentence = false
        } else {
            valid_sentence = true
        } 
    }

    /**
    * Get position longitude.
    */
    //% blockId=gpslongitude block="gps get longitude"
    //% weight=1
    export function longitude(): string {
        if (valid_sentence == true) {
            long = parseInt(results[5])
            long = (long / 100.0)
        }
        else {
            long = 0
        }
        return NMEAdata
    }

    /**
    * Get position latitude.
    */
    //% blockId=gpslatitude block="gps get latitude"
    //% weight=1
    export function latitude(): number {
        if (valid_sentence == true) {
            lat = parseInt(results[3])
            lat = (lat / 100.0)
        }
        else {
            lat = 0
        }
        return lat
    }

}
