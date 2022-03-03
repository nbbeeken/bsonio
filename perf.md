# BSON Bench

## Hardware
- cpu: Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz
- cores: 2
- os: linux
- ram: 6.7845458984375GB
- iterations: 10000

## Inputs

| name | bytes | top-level keys |
|-|-|-|
| adversarial  | 68 | 1 |
| apache_builds  | 104185 | 15 |
| blns  | 27630 | 1 |
| canada  | 1794522 | 2 |
| che-1.geo  | 17479 | 2 |
| che-2.geo  | 17479 | 2 |
| che-3.geo  | 17479 | 2 |
| citm_catalog  | 479430 | 11 |
| deep_bson  | 1966 | 2 |
| demo  | 208 | 1 |
| flat_bson  | 6046 | 145 |
| flatadversarial  | 68 | 2 |
| full_bson  | 4026 | 91 |
| github_events  | 53635 | 30 |
| google_maps_api_compact_response  | 12603 | 4 |
| google_maps_api_response  | 12603 | 4 |
| gsoc-2018  | 3078540 | 1264 |
| instruments  | 113904 | 9 |
| marine_ik  | 3077782 | 7 |
| mesh  | 894893 | 8 |
| mesh.pretty  | 894893 | 8 |
| numbers  | 138910 | 10001 |
| random  | 498964 | 4 |
| repeat  | 5520 | 4 |
| truenull  | 11895 | 2000 |
| twitter  | 444568 | 2 |
| twitter_api_compact_response  | 9843 | 2 |
| twitter_api_response  | 10683 | 2 |
| twitter_timeline  | 38158 | 20 |
| twitterescaped  | 444568 | 2 |
| update-center  | 558419 | 6 |


### Results - adversarial

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0046`ms | `0.0640` | `0.0021`ms | `0.0022`ms |
| 👨‍💻 entriesFromBSON | `0.0020`ms | `0.0083` | `0.0016`ms | `0.0017`ms |
| 👨‍💻 BSONDocument.from | `0.0026`ms | `0.0153` | `0.0024`ms | `0.0024`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0095`ms | `0.0275` | `0.0076`ms | `0.0077`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - apache_builds

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `1.9112`ms | `0.1171` | `1.8824`ms | `1.8943`ms |
| 👨‍💻 entriesFromBSON | `0.0125`ms | `0.1542` | `0.0086`ms | `0.0086`ms |
| 👨‍💻 BSONDocument.from | `0.0144`ms | `0.1572` | `0.0100`ms | `0.0101`ms |
| 👨‍💻 BSONDocument.toRecord | `1.9498`ms | `0.3067` | `1.9008`ms | `1.9144`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - blns

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2697`ms | `0.0211` | `0.2675`ms | `0.2680`ms |
| 👨‍💻 entriesFromBSON | `0.0015`ms | `0.0057` | `0.0014`ms | `0.0014`ms |
| 👨‍💻 BSONDocument.from | `0.0024`ms | `0.0042` | `0.0023`ms | `0.0023`ms |
| 👨‍💻 BSONDocument.toRecord | `1.1088`ms | `0.0651` | `1.0877`ms | `1.0954`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - canada

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `45.9303`ms | `9.3786` | `36.0190`ms | `42.4622`ms |
| 👨‍💻 entriesFromBSON | `0.0020`ms | `0.0055` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 BSONDocument.from | `0.0028`ms | `0.0060` | `0.0027`ms | `0.0027`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0093`ms | `0.0086` | `0.0091`ms | `0.0091`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-1.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2335`ms | `0.0495` | `0.2259`ms | `0.2258`ms |
| 👨‍💻 entriesFromBSON | `0.0020`ms | `0.0068` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 BSONDocument.from | `0.0028`ms | `0.0052` | `0.0026`ms | `0.0027`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0094`ms | `0.0094` | `0.0091`ms | `0.0091`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-2.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2336`ms | `0.0493` | `0.2259`ms | `0.2259`ms |
| 👨‍💻 entriesFromBSON | `0.0020`ms | `0.0062` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 BSONDocument.from | `0.0028`ms | `0.0051` | `0.0027`ms | `0.0027`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0093`ms | `0.0078` | `0.0090`ms | `0.0091`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-3.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2328`ms | `0.0459` | `0.2252`ms | `0.2256`ms |
| 👨‍💻 entriesFromBSON | `0.0019`ms | `0.0004` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 BSONDocument.from | `0.0048`ms | `0.1125` | `0.0026`ms | `0.0026`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0099`ms | `0.0194` | `0.0089`ms | `0.0090`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - citm_catalog

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `13.3453`ms | `0.7055` | `12.9225`ms | `12.9323`ms |
| 👨‍💻 entriesFromBSON | `0.0090`ms | `0.0852` | `0.0068`ms | `0.0068`ms |
| 👨‍💻 BSONDocument.from | `0.0086`ms | `0.0080` | `0.0083`ms | `0.0084`ms |
| 👨‍💻 BSONDocument.toRecord | `0.7126`ms | `0.0772` | `0.6958`ms | `0.6972`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - deep_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0659`ms | `0.0141` | `0.0649`ms | `0.0651`ms |
| 👨‍💻 entriesFromBSON | `0.0018`ms | `0.0047` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0026`ms | `0.0047` | `0.0025`ms | `0.0025`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0094`ms | `0.0075` | `0.0090`ms | `0.0091`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - demo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0053`ms | `0.0055` | `0.0051`ms | `0.0051`ms |
| 👨‍💻 entriesFromBSON | `0.0015`ms | `0.0048` | `0.0014`ms | `0.0014`ms |
| 👨‍💻 BSONDocument.from | `0.0023`ms | `0.0039` | `0.0022`ms | `0.0022`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0069`ms | `0.0057` | `0.0066`ms | `0.0066`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flat_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1319`ms | `0.0381` | `0.1287`ms | `0.1290`ms |
| 👨‍💻 entriesFromBSON | `0.0569`ms | `0.0192` | `0.0551`ms | `0.0553`ms |
| 👨‍💻 BSONDocument.from | `0.0717`ms | `0.0196` | `0.0695`ms | `0.0699`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4171`ms | `0.0445` | `0.4071`ms | `0.4066`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flatadversarial

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0036`ms | `0.0063` | `0.0035`ms | `0.0035`ms |
| 👨‍💻 entriesFromBSON | `0.0026`ms | `0.0130` | `0.0017`ms | `0.0017`ms |
| 👨‍💻 BSONDocument.from | `0.0029`ms | `0.0167` | `0.0024`ms | `0.0024`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0183`ms | `0.0229` | `0.0170`ms | `0.0172`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - full_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1100`ms | `0.0495` | `0.1050`ms | `0.1055`ms |
| 👨‍💻 entriesFromBSON | `0.0361`ms | `0.0165` | `0.0348`ms | `0.0350`ms |
| 👨‍💻 BSONDocument.from | `0.0447`ms | `0.0164` | `0.0433`ms | `0.0435`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4586`ms | `0.0565` | `0.4478`ms | `0.4491`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - github_events

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.8820`ms | `0.0441` | `0.8738`ms | `0.8754`ms |
| 👨‍💻 entriesFromBSON | `0.0083`ms | `0.0091` | `0.0078`ms | `0.0079`ms |
| 👨‍💻 BSONDocument.from | `0.0105`ms | `0.0098` | `0.0100`ms | `0.0101`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2031`ms | `0.0338` | `0.1982`ms | `0.1988`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.4040`ms | `0.0329` | `0.3990`ms | `0.4000`ms |
| 👨‍💻 entriesFromBSON | `0.0033`ms | `0.0056` | `0.0032`ms | `0.0032`ms |
| 👨‍💻 BSONDocument.from | `0.0042`ms | `0.0074` | `0.0040`ms | `0.0040`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0776`ms | `0.0171` | `0.0762`ms | `0.0765`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.4034`ms | `0.0327` | `0.3990`ms | `0.3993`ms |
| 👨‍💻 entriesFromBSON | `0.0033`ms | `0.0045` | `0.0032`ms | `0.0032`ms |
| 👨‍💻 BSONDocument.from | `0.0042`ms | `0.0077` | `0.0040`ms | `0.0040`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0778`ms | `0.0172` | `0.0762`ms | `0.0765`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - gsoc-2018

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `22.6046`ms | `0.2956` | `22.3830`ms | `22.4513`ms |
| 👨‍💻 entriesFromBSON | `0.3389`ms | `0.0585` | `0.3243`ms | `0.3275`ms |
| 👨‍💻 BSONDocument.from | `0.4222`ms | `0.0629` | `0.4060`ms | `0.4092`ms |
| 👨‍💻 BSONDocument.toRecord | `8.3173`ms | `0.2175` | `8.1332`ms | `8.1883`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - instruments

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `3.1479`ms | `0.0981` | `3.1258`ms | `3.1272`ms |
| 👨‍💻 entriesFromBSON | `0.0048`ms | `0.0050` | `0.0047`ms | `0.0047`ms |
| 👨‍💻 BSONDocument.from | `0.0061`ms | `0.0052` | `0.0059`ms | `0.0060`ms |
| 👨‍💻 BSONDocument.toRecord | `0.7985`ms | `0.0488` | `0.7869`ms | `0.7885`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - marine_ik

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `51.3455`ms | `6.4212` | `47.5754`ms | `49.2677`ms |
| 👨‍💻 entriesFromBSON | `0.0069`ms | `0.0923` | `0.0040`ms | `0.0041`ms |
| 👨‍💻 BSONDocument.from | `0.0055`ms | `0.0111` | `0.0052`ms | `0.0052`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0445`ms | `0.0266` | `0.0425`ms | `0.0428`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - mesh

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `10.9263`ms | `0.7392` | `10.3972`ms | `10.4270`ms |
| 👨‍💻 entriesFromBSON | `0.0057`ms | `0.0399` | `0.0043`ms | `0.0043`ms |
| 👨‍💻 BSONDocument.from | `0.0058`ms | `0.0084` | `0.0055`ms | `0.0055`ms |
| 👨‍💻 BSONDocument.toRecord | `193.2556`ms | `8.5683` | `188.3804`ms | `190.0790`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - mesh.pretty

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `10.8849`ms | `0.8282` | `10.3916`ms | `10.4126`ms |
| 👨‍💻 entriesFromBSON | `0.0060`ms | `0.0869` | `0.0043`ms | `0.0044`ms |
| 👨‍💻 BSONDocument.from | `0.0056`ms | `0.0050` | `0.0055`ms | `0.0055`ms |
| 👨‍💻 BSONDocument.toRecord | `192.5598`ms | `8.5099` | `194.2134`ms | `190.0624`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - numbers

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `2.8581`ms | `0.1085` | `2.8300`ms | `2.8315`ms |
| 👨‍💻 entriesFromBSON | `2.9580`ms | `0.4755` | `2.7260`ms | `2.7285`ms |
| 👨‍💻 BSONDocument.from | `5.0040`ms | `2.2317` | `3.9225`ms | `3.9834`ms |
| 👨‍💻 BSONDocument.toRecord | `21.8280`ms | `0.4575` | `21.5243`ms | `21.6285`ms |

Fastest: 🍃 BSON.deserialize

### Results - random

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `13.6742`ms | `0.4524` | `13.4906`ms | `13.4881`ms |
| 👨‍💻 entriesFromBSON | `0.0064`ms | `0.0358` | `0.0033`ms | `0.0034`ms |
| 👨‍💻 BSONDocument.from | `0.0037`ms | `0.0113` | `0.0032`ms | `0.0033`ms |
| 👨‍💻 BSONDocument.toRecord | `2.1256`ms | `0.1188` | `2.0848`ms | `2.0983`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - repeat

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1406`ms | `0.0183` | `0.1388`ms | `0.1391`ms |
| 👨‍💻 entriesFromBSON | `0.0025`ms | `0.0043` | `0.0024`ms | `0.0024`ms |
| 👨‍💻 BSONDocument.from | `0.0033`ms | `0.0044` | `0.0032`ms | `0.0033`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2196`ms | `0.0284` | `0.2156`ms | `0.2161`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - truenull

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.5752`ms | `0.0316` | `0.5702`ms | `0.5707`ms |
| 👨‍💻 entriesFromBSON | `0.5208`ms | `0.0781` | `0.5004`ms | `0.5037`ms |
| 👨‍💻 BSONDocument.from | `0.6341`ms | `0.1009` | `0.6098`ms | `0.6116`ms |
| 👨‍💻 BSONDocument.toRecord | `3.9874`ms | `0.0961` | `3.9594`ms | `3.9611`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `10.4014`ms | `0.3314` | `10.2595`ms | `10.2657`ms |
| 👨‍💻 entriesFromBSON | `0.0022`ms | `0.0052` | `0.0021`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.from | `0.0030`ms | `0.0042` | `0.0029`ms | `0.0029`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2212`ms | `0.0295` | `0.2174`ms | `0.2177`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2140`ms | `0.0209` | `0.2117`ms | `0.2121`ms |
| 👨‍💻 entriesFromBSON | `0.0023`ms | `0.0252` | `0.0015`ms | `0.0015`ms |
| 👨‍💻 BSONDocument.from | `0.0023`ms | `0.0044` | `0.0022`ms | `0.0022`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0253`ms | `0.0086` | `0.0247`ms | `0.0248`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2476`ms | `0.0234` | `0.2454`ms | `0.2453`ms |
| 👨‍💻 entriesFromBSON | `0.0016`ms | `0.0054` | `0.0015`ms | `0.0015`ms |
| 👨‍💻 BSONDocument.from | `0.0023`ms | `0.0039` | `0.0022`ms | `0.0022`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0374`ms | `0.0153` | `0.0362`ms | `0.0364`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_timeline

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.9254`ms | `0.0457` | `0.9169`ms | `0.9179`ms |
| 👨‍💻 entriesFromBSON | `0.0057`ms | `0.0079` | `0.0054`ms | `0.0054`ms |
| 👨‍💻 BSONDocument.from | `0.0076`ms | `0.0082` | `0.0072`ms | `0.0073`ms |
| 👨‍💻 BSONDocument.toRecord | `0.3012`ms | `0.0381` | `0.2946`ms | `0.2951`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitterescaped

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `10.4121`ms | `0.3466` | `10.2644`ms | `10.2704`ms |
| 👨‍💻 entriesFromBSON | `0.0022`ms | `0.0054` | `0.0021`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.from | `0.0030`ms | `0.0046` | `0.0029`ms | `0.0029`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2216`ms | `0.0303` | `0.2173`ms | `0.2179`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - update-center

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `11.3117`ms | `0.4452` | `11.1600`ms | `11.1480`ms |
| 👨‍💻 entriesFromBSON | `0.0041`ms | `0.0063` | `0.0039`ms | `0.0039`ms |
| 👨‍💻 BSONDocument.from | `0.0050`ms | `0.0040` | `0.0049`ms | `0.0049`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4532`ms | `0.0461` | `0.4440`ms | `0.4444`ms |

Fastest: 👨‍💻 entriesFromBSON
