/**
 * Reading data of module gps.
 */
//% weight=2 color=#002050 icon="\uf041"
//% advanced=true blockGap=8
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
    let gps_good = false
    let NMEAdata: string = ""; // another iframe could write to this

    // The buffer size that will hold a GPS sentence. They tend to be 80 characters long
    // so 90 is plenty.
    serial.setRxBufferSize(90)    // plenty big

    function toInt(input: string, radix?: number) {
        if (!input || input.length === 0) return 0; // Temporal to error is being listed in pxt-core.d.ts for some reason
        const numberOffset = '0'.charCodeAt(0);
        const letterOffset = 'a'.charCodeAt(0);
        const lowerCaseMask = 0x20;
        let output = 0;

        let sign = 1;
        switch (input.charAt(0)) {
            case "-":
                sign = -1;
            case "+":
                input = input.substr(1);
        }

        if ((!radix || radix == 16) && input.slice(0, 2) == "0x") {
            radix = 16;
            input = input.substr(2);
        } else if (!radix) {
            radix = 10;
        }

        for (let i = 0; i < input.length; ++i) {
            const code = input.charCodeAt(i) | lowerCaseMask;
            let val: number = undefined;

            if (code >= numberOffset && code < numberOffset + 10)
                val = code - numberOffset;
            else if (code >= letterOffset && code < letterOffset + 26)
                val = 10 + code - letterOffset;

            if (val == undefined || val >= radix)
                break;
            output = output * radix + val;
        }

        return sign * output;
    }

    /**
     * Checks that the given NMEA sentence has a valid checksum.
     */
    function validNmeaChecksum(nmeaSentence: string): boolean {
        let sentence = nmeaSentence.split("*")
        let sentenceWithoutChecksum = sentence[0]
        let checksumString = sentence[1]
        let correctChecksum = computeNmeaChecksum(sentenceWithoutChecksum);

        // checksum is a 2 digit hex value
        let actualChecksum = toInt(checksumString, 16)

        return correctChecksum === actualChecksum
    }


    /**
     * Generate a checksum for an NMEA sentence without the trailing "*xx".
     */
    function computeNmeaChecksum(sentenceWithoutChecksum: string): number {
        // init to first character value after the $
        let checksum = sentenceWithoutChecksum.charCodeAt(1);

        // process rest of characters, zero delimited
        for (let i = 2; i < sentenceWithoutChecksum.length; i += 1) {
            checksum = checksum ^ sentenceWithoutChecksum.charCodeAt(i);
        }

        // checksum is between 0x00 and 0xff
        checksum = checksum & 0xff;

        return checksum;
    }

    /**
    * Get encode.
    */
    //% blockId=gpsencode block="gps encode"
    //% weight=1
    //% parts=gps trackArgs=0
    export function encode() {
      NMEAdata = serial.readLine()
      if (validNmeaChecksum(NMEAdata)) {
        results = NMEAdata.split("*")[0].split(",");
          if (results[0] == "$GPRMC") {
            utc = results[1]
            lat = results[3]
            lat_dir = results[4]
            long = results[5]
            lon_dir = results[6]
            speed = results[7]
            course = results[8]
            date = results[9]
            if (results[2] == "A") {
                gps_good = true
            } else {
                gps_good = false
            }
          }

          if (results[0] == "$GPGGA") {
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
    //% parts=gps trackArgs=0
    export function longitude(): number {
        if (gps_good == true) {
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
            _long = undefined
        }
        return _long
    }

    /**
    * Get position latitude.
    */
    //% blockId=gpslatitude block="gps get latitude"
    //% weight=1
    //% parts=gps trackArgs=0
    export function latitude(): number {
        if (gps_good == true) {
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
            _lat = undefined
        }
        return _lat
    }


    /**
    * Get position altitude. 1 decimal, always meters
    */
    //% blockId=gpsaltitude block="gps get altitude"
    //% weight=1
    //% parts=gps trackArgs=0
    export function altitude(): number {
        if (gps_good == true) {
            return parseFloat(alt)
        }
        else {
            return alt = undefined
        }
    }

    /**
    * Get position Date Time.
    */
    //% blockId=gpsparseDateTime block="gps get Date Time"
    //% weight=1
    //% parts=gps trackArgs=0
    export function dateTime(): string {
        if (gps_good == true) {
            let h = utc.slice(0, 2);  //Hour
            let m = utc.slice(2, 4);  // Minute
            let s = utc.slice(4, 6);  // Second
            let D = date.slice(0, 2);  // Day
            let M = date.slice(2, 4);  // Month
            let Y = date.slice(4, 6);  // Year

            return Y + "/" + M + "/" + D + "/" + h + ":" + m + ":" + s
        }
        else {
            return "DATE invalid";
        }
    }
}
