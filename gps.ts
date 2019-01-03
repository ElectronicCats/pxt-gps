namespace gps {
    let _long = 0
    let _lat = 0
    let lat = ""
    let long = ""
    let utc = ""
    let speed = ""
    let course = ""
    let quality = ""
    let alt = ""
    let fix = ""
    let lat_dir = ""
    let lon_dir = ""
    let date = ""
    let results: string[] = []
    let valid_sentence = false
    let NMEAdata: string = ""; // another iframe could write to this

    // The buffer size that will hold a GPS sentence. They tend to be 80 characters long
    // so 90 is plenty.
    serial.setRxBufferSize(90)    // plenty big

    /**
    * Get encode.
    */
    //% blockId=gpsencode block="gps encode"
    //% weight=1
    export function encode() {
        NMEAdata = serial.readLine()
        results = NMEAdata.split(",")
        if (results[0] == "$GPRMC") {
            if (results.length() == 13) {
                utc = results[1]
                lat = results[3]
                lat_dir = results[4]
                long = results[5]
                lon_dir = results[6]
                speed = results[7]
                course = results[8]
                date = results[9]

                if (results[2] == "A") {
                    valid_sentence = true
                } else {
                    valid_sentence = false
                }
            }
        }

        if (results[0] == "$GPGGA") {
            if (results.length() == 15) {
                utc = results[1]
                lat = results[2]
                lat_dir = results[3]
                long = results[4]
                lon_dir = results[5]
                quality = results[6]
                alt = results[9]

                if (quality == "0") {
                    fix = "Fix not available or invalid"
                } else {
                    fix = "Fix"
                }
            }
        }
    }

    /**
    * Get position longitude.
    */
    //% blockId=gpslongitude block="gps get longitude"
    //% weight=1
    export function longitude(): number {
        if (valid_sentence == true) {
            let h;
            let a;
            let dg;
            let mn;
            h = (lon_dir === 'E') ? 1.0 : -1.0;
            a = long.split('.');
            if (a[0].length === 5) {
                // three digits of degrees
                dg = long.substr(0, 3);
                mn = long.substr(3);
            } else if (a[0].length === 4) {
                // 2 digits of degrees (in case no leading zero)
                dg = long.substr(0, 2);
                mn = long.substr(2);
            } else if (a[0].length === 3) {
                // 1 digit of degrees (in case no leading zero)
                dg = long.substr(0, 1);
                mn = long.substr(1);
            } else {
                // no degrees, just minutes (nonstandard but a buggy unit might do this)
                dg = '0';
                mn = long;
            }
            // longitude is usually precise to 5-8 digits
            _long = ((parseFloat(dg) + (parseFloat(mn) / 60.0)) * h);
        }
        else {
            console.log("Fix not available or invalid")
        }
        return _long
    }

    /**
    * Get position latitude.
    */
    //% blockId=gpslatitude block="gps get latitude"
    //% weight=1
    export function latitude(): number {
        if (valid_sentence == true) {
            let h = (lat_dir === 'N') ? 1.0 : -1.0;
            let a;
            let dg;
            let mn;
            let l;
            a = lat.split('.');
            if (a[0].length === 4) {
                // two digits of degrees
                dg = lat.substr(0, 2);
                mn = lat.substr(2);
            } else if (a[0].length === 3) {
                // 1 digit of degrees (in case no leading zero)
                dg = lat.substr(0, 1);
                mn = lat.substr(1);
            } else {
                // no degrees, just minutes (nonstandard but a buggy unit might do this)
                dg = '0';
                mn = lat;
            }
            // latitude is usually precise to 5-8 digits
            _lat = (parseFloat(dg) + (parseFloat(mn) / 60.0)) * h;
        }
        else {
            console.log("Fix not available or invalid")
        }
        return _lat
    }


    /**
    * Get position altitude. 1 decimal, always meters
    */
    //% blockId=gpsaltitude block="gps get altitude"
    //% weight=1
    export function altitude(): string {
        if (alt === undefined) {
            console.log("Error undefined")
        }
        return alt;
    }

    /**
    * Get position Date Time.
    */
    //% blockId=gpsparseDateTime block="gps get Date Time"
    //% weight=1
    export function DateTime(): string {
        let h = utc.slice(0, 2);  //Hour
        let m = utc.slice(2, 4);  // Minute
        let s = utc.slice(4, 6);  // Second
        let D = date.slice(0, 2);  // Day
        let M = date.slice(2, 4);  // Month
        let Y = date.slice(4, 6);  // Year

        return Y + "/" + M + "/" + D + "/" + h +":"+ m + ":" + s
    }

}
