# BSON Bench

## Hardware
- cpu: Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz
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
| 🍃 BSON.deserialize | `0.0038`ms | `0.0328` | `0.0018`ms | `0.0019`ms |
| 👨‍💻 entriesFromBSON | `0.0023`ms | `0.0078` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0025`ms | `0.0165` | `0.0020`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0074`ms | `0.0296` | `0.0048`ms | `0.0051`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - apache_builds

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `1.7599`ms | `0.3204` | `1.5528`ms | `1.6514`ms |
| 👨‍💻 entriesFromBSON | `0.0118`ms | `0.1228` | `0.0072`ms | `0.0079`ms |
| 👨‍💻 BSONDocument.from | `0.0146`ms | `0.1157` | `0.0086`ms | `0.0093`ms |
| 👨‍💻 BSONDocument.toRecord | `1.1153`ms | `0.9220` | `0.7946`ms | `0.8511`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - blns

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2374`ms | `0.0674` | `0.2154`ms | `0.2161`ms |
| 👨‍💻 entriesFromBSON | `0.0014`ms | `0.0015` | `0.0012`ms | `0.0012`ms |
| 👨‍💻 BSONDocument.from | `0.0021`ms | `0.0068` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.toRecord | `0.6466`ms | `0.6845` | `0.4549`ms | `0.4880`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - canada

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `45.2868`ms | `9.9553` | `47.9872`ms | `42.9778`ms |
| 👨‍💻 entriesFromBSON | `0.0021`ms | `0.0104` | `0.0015`ms | `0.0016`ms |
| 👨‍💻 BSONDocument.from | `0.0027`ms | `0.0043` | `0.0024`ms | `0.0024`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0051`ms | `0.0071` | `0.0044`ms | `0.0045`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-1.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2526`ms | `0.0841` | `0.2104`ms | `0.2250`ms |
| 👨‍💻 entriesFromBSON | `0.0017`ms | `0.0024` | `0.0015`ms | `0.0015`ms |
| 👨‍💻 BSONDocument.from | `0.0027`ms | `0.0052` | `0.0022`ms | `0.0023`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0061`ms | `0.0070` | `0.0048`ms | `0.0050`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-2.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2590`ms | `0.0976` | `0.2067`ms | `0.2308`ms |
| 👨‍💻 entriesFromBSON | `0.0024`ms | `0.0076` | `0.0020`ms | `0.0019`ms |
| 👨‍💻 BSONDocument.from | `0.0025`ms | `0.0040` | `0.0023`ms | `0.0023`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0057`ms | `0.0099` | `0.0045`ms | `0.0047`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-3.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2356`ms | `0.0621` | `0.2023`ms | `0.2156`ms |
| 👨‍💻 entriesFromBSON | `0.0017`ms | `0.0044` | `0.0015`ms | `0.0015`ms |
| 👨‍💻 BSONDocument.from | `0.0033`ms | `0.0217` | `0.0024`ms | `0.0025`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0054`ms | `0.0062` | `0.0048`ms | `0.0048`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - citm_catalog

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `12.6981`ms | `1.4515` | `11.5652`ms | `12.3269`ms |
| 👨‍💻 entriesFromBSON | `0.0084`ms | `0.0601` | `0.0058`ms | `0.0058`ms |
| 👨‍💻 BSONDocument.from | `0.0078`ms | `0.0070` | `0.0072`ms | `0.0072`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4432`ms | `0.1336` | `0.3579`ms | `0.4001`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - deep_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0649`ms | `0.0501` | `0.0553`ms | `0.0561`ms |
| 👨‍💻 entriesFromBSON | `0.0018`ms | `0.0032` | `0.0015`ms | `0.0015`ms |
| 👨‍💻 BSONDocument.from | `0.0026`ms | `0.0051` | `0.0022`ms | `0.0023`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0063`ms | `0.0093` | `0.0056`ms | `0.0057`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - demo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0047`ms | `0.0058` | `0.0042`ms | `0.0043`ms |
| 👨‍💻 entriesFromBSON | `0.0014`ms | `0.0040` | `0.0013`ms | `0.0012`ms |
| 👨‍💻 BSONDocument.from | `0.0021`ms | `0.0042` | `0.0018`ms | `0.0019`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0052`ms | `0.0057` | `0.0045`ms | `0.0046`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flat_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1350`ms | `0.0666` | `0.1078`ms | `0.1175`ms |
| 👨‍💻 entriesFromBSON | `0.0619`ms | `0.0318` | `0.0486`ms | `0.0535`ms |
| 👨‍💻 BSONDocument.from | `0.0676`ms | `0.0313` | `0.0610`ms | `0.0619`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2386`ms | `0.0795` | `0.2034`ms | `0.2148`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flatadversarial

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0044`ms | `0.0079` | `0.0033`ms | `0.0033`ms |
| 👨‍💻 entriesFromBSON | `0.0016`ms | `0.0041` | `0.0014`ms | `0.0014`ms |
| 👨‍💻 BSONDocument.from | `0.0022`ms | `0.0104` | `0.0020`ms | `0.0020`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0090`ms | `0.0238` | `0.0074`ms | `0.0075`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - full_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1045`ms | `0.0605` | `0.0893`ms | `0.0912`ms |
| 👨‍💻 entriesFromBSON | `0.0341`ms | `0.0164` | `0.0307`ms | `0.0312`ms |
| 👨‍💻 BSONDocument.from | `0.0486`ms | `0.0544` | `0.0383`ms | `0.0408`ms |
| 👨‍💻 BSONDocument.toRecord | `0.3344`ms | `0.1589` | `0.2561`ms | `0.2990`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - github_events

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.7750`ms | `0.1922` | `0.6688`ms | `0.7109`ms |
| 👨‍💻 entriesFromBSON | `0.0092`ms | `0.0094` | `0.0074`ms | `0.0078`ms |
| 👨‍💻 BSONDocument.from | `0.0106`ms | `0.0093` | `0.0093`ms | `0.0094`ms |
| 👨‍💻 BSONDocument.toRecord | `0.1758`ms | `0.0650` | `0.1422`ms | `0.1581`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.3731`ms | `0.0951` | `0.3160`ms | `0.3421`ms |
| 👨‍💻 entriesFromBSON | `0.0029`ms | `0.0068` | `0.0026`ms | `0.0026`ms |
| 👨‍💻 BSONDocument.from | `0.0036`ms | `0.0036` | `0.0033`ms | `0.0034`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0387`ms | `0.0270` | `0.0311`ms | `0.0339`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.3544`ms | `0.1171` | `0.3184`ms | `0.3226`ms |
| 👨‍💻 entriesFromBSON | `0.0030`ms | `0.0065` | `0.0026`ms | `0.0027`ms |
| 👨‍💻 BSONDocument.from | `0.0036`ms | `0.0035` | `0.0033`ms | `0.0034`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0349`ms | `0.0149` | `0.0311`ms | `0.0319`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - gsoc-2018

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `18.6324`ms | `1.8696` | `17.9059`ms | `18.0399`ms |
| 👨‍💻 entriesFromBSON | `0.4023`ms | `0.1593` | `0.3059`ms | `0.3574`ms |
| 👨‍💻 BSONDocument.from | `0.4862`ms | `0.1547` | `0.3972`ms | `0.4387`ms |
| 👨‍💻 BSONDocument.toRecord | `6.5970`ms | `0.8707` | `6.0252`ms | `6.3743`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - instruments

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `2.8429`ms | `0.4049` | `2.4805`ms | `2.7335`ms |
| 👨‍💻 entriesFromBSON | `0.0095`ms | `0.0272` | `0.0041`ms | `0.0073`ms |
| 👨‍💻 BSONDocument.from | `0.0066`ms | `0.0119` | `0.0051`ms | `0.0053`ms |
| 👨‍💻 BSONDocument.toRecord | `0.3833`ms | `0.1184` | `0.3073`ms | `0.3440`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - marine_ik

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `52.1915`ms | `5.2386` | `51.3445`ms | `50.9502`ms |
| 👨‍💻 entriesFromBSON | `0.0055`ms | `0.0316` | `0.0034`ms | `0.0036`ms |
| 👨‍💻 BSONDocument.from | `0.0052`ms | `0.0067` | `0.0044`ms | `0.0046`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0346`ms | `0.0232` | `0.0277`ms | `0.0295`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - mesh

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `10.0585`ms | `1.1962` | `9.0917`ms | `9.8275`ms |
| 👨‍💻 entriesFromBSON | `0.0045`ms | `0.0075` | `0.0037`ms | `0.0039`ms |
| 👨‍💻 BSONDocument.from | `0.0061`ms | `0.0081` | `0.0049`ms | `0.0050`ms |
| 👨‍💻 BSONDocument.toRecord | `105.1780`ms | `13.7911` | `118.4552`ms | `102.4765`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - mesh.pretty

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `10.1486`ms | `1.5032` | `9.6401`ms | `9.8205`ms |
| 👨‍💻 entriesFromBSON | `0.0060`ms | `0.0363` | `0.0039`ms | `0.0040`ms |
| 👨‍💻 BSONDocument.from | `0.0057`ms | `0.0144` | `0.0046`ms | `0.0048`ms |
| 👨‍💻 BSONDocument.toRecord | `105.1148`ms | `12.1244` | `95.6483`ms | `102.0956`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - numbers

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `2.8415`ms | `0.4357` | `2.4844`ms | `2.7082`ms |
| 👨‍💻 entriesFromBSON | `2.9898`ms | `0.5760` | `2.4481`ms | `2.7905`ms |
| 👨‍💻 BSONDocument.from | `5.0318`ms | `2.3823` | `3.8038`ms | `4.1331`ms |
| 👨‍💻 BSONDocument.toRecord | `9.6300`ms | `1.1015` | `9.4440`ms | `9.2952`ms |

Fastest: 🍃 BSON.deserialize

### Results - random

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `12.1384`ms | `1.2910` | `11.8059`ms | `11.7634`ms |
| 👨‍💻 entriesFromBSON | `0.0050`ms | `0.0459` | `0.0020`ms | `0.0023`ms |
| 👨‍💻 BSONDocument.from | `0.0035`ms | `0.0141` | `0.0029`ms | `0.0029`ms |
| 👨‍💻 BSONDocument.toRecord | `0.9406`ms | `0.2163` | `0.8329`ms | `0.8589`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - repeat

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1368`ms | `0.0912` | `0.1134`ms | `0.1204`ms |
| 👨‍💻 entriesFromBSON | `0.0023`ms | `0.0079` | `0.0020`ms | `0.0020`ms |
| 👨‍💻 BSONDocument.from | `0.0032`ms | `0.0035` | `0.0029`ms | `0.0030`ms |
| 👨‍💻 BSONDocument.toRecord | `0.1007`ms | `0.0728` | `0.0894`ms | `0.0905`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - truenull

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.6381`ms | `0.1980` | `0.4975`ms | `0.5921`ms |
| 👨‍💻 entriesFromBSON | `0.5173`ms | `0.1301` | `0.4355`ms | `0.4704`ms |
| 👨‍💻 BSONDocument.from | `0.6640`ms | `0.1551` | `0.5972`ms | `0.6138`ms |
| 👨‍💻 BSONDocument.toRecord | `1.5923`ms | `0.2981` | `1.3921`ms | `1.5078`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `9.3961`ms | `1.0602` | `8.3900`ms | `9.0869`ms |
| 👨‍💻 entriesFromBSON | `0.0048`ms | `0.0306` | `0.0018`ms | `0.0028`ms |
| 👨‍💻 BSONDocument.from | `0.0038`ms | `0.0164` | `0.0027`ms | `0.0028`ms |
| 👨‍💻 BSONDocument.toRecord | `0.1001`ms | `0.0369` | `0.0878`ms | `0.0895`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - twitter_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1890`ms | `0.0645` | `0.1646`ms | `0.1671`ms |
| 👨‍💻 entriesFromBSON | `0.0016`ms | `0.0045` | `0.0013`ms | `0.0013`ms |
| 👨‍💻 BSONDocument.from | `0.0024`ms | `0.0050` | `0.0020`ms | `0.0020`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0216`ms | `0.0150` | `0.0190`ms | `0.0195`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2283`ms | `0.0919` | `0.1982`ms | `0.2006`ms |
| 👨‍💻 entriesFromBSON | `0.0014`ms | `0.0038` | `0.0012`ms | `0.0013`ms |
| 👨‍💻 BSONDocument.from | `0.0020`ms | `0.0031` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0373`ms | `0.0390` | `0.0285`ms | `0.0313`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_timeline

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.8070`ms | `0.1930` | `0.7231`ms | `0.7380`ms |
| 👨‍💻 entriesFromBSON | `0.0051`ms | `0.0061` | `0.0047`ms | `0.0047`ms |
| 👨‍💻 BSONDocument.from | `0.0073`ms | `0.0111` | `0.0063`ms | `0.0064`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2587`ms | `0.0771` | `0.2304`ms | `0.2351`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitterescaped

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `9.3870`ms | `1.1004` | `8.9092`ms | `9.0448`ms |
| 👨‍💻 entriesFromBSON | `0.0023`ms | `0.0152` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 BSONDocument.from | `0.0031`ms | `0.0042` | `0.0026`ms | `0.0026`ms |
| 👨‍💻 BSONDocument.toRecord | `0.1070`ms | `0.0610` | `0.0884`ms | `0.0935`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - update-center

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `10.3335`ms | `1.2055` | `9.3797`ms | `9.9777`ms |
| 👨‍💻 entriesFromBSON | `0.0037`ms | `0.0063` | `0.0032`ms | `0.0033`ms |
| 👨‍💻 BSONDocument.from | `0.0048`ms | `0.0124` | `0.0044`ms | `0.0043`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4805`ms | `0.1286` | `0.4077`ms | `0.4461`ms |

Fastest: 👨‍💻 entriesFromBSON
