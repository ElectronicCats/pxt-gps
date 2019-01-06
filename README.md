# GPS
[![Build Status](https://travis-ci.org/ElectronicCats/pxt-gps.svg?branch=master)](https://travis-ci.org/ElectronicCats/pxt-gps) 


This package adds functionality to the GPS breakout.

This is the Electronic Cats GPS makecode extension. Tested and works great with the L80 GPS module using MTK33x9 chipset

These modules use TTL serial to communicate, 2 pins are required to interface

Electronic Cats invests time and resources providing this open source design, please support Electronic Cats and open-source hardware by purchasing products from Electronic Cats!

## Usage
```
forever(function () {
    gps.encode()
    console.log("" + gps.longitude())
    console.log("" + gps.latitude())
    console.log("" + gps.altitude())
})
```

## API

- `function encode()` : encode sentence Nmea GPS  

- `function latitude()` : return latitude.

- `function longitude():` return longitude

- `function altitude()`: return altitude in meters.

- `function Date Time()`: return date and time UTC.


## TODO

- [ ] Use "pxt bump" to create a tagged release on GitHub
- [ ] Get your package reviewed and approved https://maker.makecode.com/packages/approval

## License

MIT

Copyright (c) 2019, Electronic Cats  

## Maintainer

[Electronic Cats](https://github.com/ElectronicCats) invests time and resources providing this open source design, please support Electronic Cats and open-source hardware by purchasing products from Electronic Cats!

## Supported targets

* for PXT/maker
* for PXT/micro:bit

```package
gps
```

