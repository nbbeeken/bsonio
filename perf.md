# BSON Bench

## Hardware
- cpu: Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz
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
| 🍃 BSON.deserialize | `0.0050`ms | `0.1031` | `0.0024`ms | `0.0025`ms |
| 👨‍💻 entriesFromBSON | `0.0023`ms | `0.0111` | `0.0020`ms | `0.0020`ms |
| 👨‍💻 BSONDocument.from | `0.0032`ms | `0.0150` | `0.0028`ms | `0.0029`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0090`ms | `0.0890` | `0.0059`ms | `0.0059`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - apache_builds

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `2.2842`ms | `0.1527` | `2.3066`ms | `2.2963`ms |
| 👨‍💻 entriesFromBSON | `0.0147`ms | `0.1666` | `0.0103`ms | `0.0103`ms |
| 👨‍💻 BSONDocument.from | `0.0162`ms | `0.1533` | `0.0121`ms | `0.0121`ms |
| 👨‍💻 BSONDocument.toRecord | `0.9640`ms | `0.2444` | `0.9535`ms | `0.9530`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - blns

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.3209`ms | `0.0253` | `0.3256`ms | `0.3256`ms |
| 👨‍💻 entriesFromBSON | `0.0017`ms | `0.0053` | `0.0016`ms | `0.0016`ms |
| 👨‍💻 BSONDocument.from | `0.0026`ms | `0.0039` | `0.0025`ms | `0.0025`ms |
| 👨‍💻 BSONDocument.toRecord | `0.5431`ms | `0.0711` | `0.5417`ms | `0.5406`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - canada

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `53.4872`ms | `12.0133` | `45.5098`ms | `49.1468`ms |
| 👨‍💻 entriesFromBSON | `0.0039`ms | `0.0795` | `0.0021`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.from | `0.0032`ms | `0.0060` | `0.0030`ms | `0.0031`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0063`ms | `0.0070` | `0.0063`ms | `0.0062`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - che-1.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2723`ms | `0.0436` | `0.2699`ms | `0.2696`ms |
| 👨‍💻 entriesFromBSON | `0.0022`ms | `0.0006` | `0.0021`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.from | `0.0031`ms | `0.0057` | `0.0030`ms | `0.0030`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0064`ms | `0.0069` | `0.0062`ms | `0.0062`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-2.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2719`ms | `0.0435` | `0.2697`ms | `0.2694`ms |
| 👨‍💻 entriesFromBSON | `0.0022`ms | `0.0055` | `0.0021`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.from | `0.0031`ms | `0.0061` | `0.0031`ms | `0.0030`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0065`ms | `0.0074` | `0.0063`ms | `0.0062`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-3.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2716`ms | `0.0433` | `0.2697`ms | `0.2693`ms |
| 👨‍💻 entriesFromBSON | `0.0022`ms | `0.0058` | `0.0020`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.from | `0.0031`ms | `0.0048` | `0.0031`ms | `0.0030`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0105`ms | `0.0611` | `0.0067`ms | `0.0067`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - citm_catalog

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `15.4179`ms | `1.0301` | `15.1131`ms | `15.1070`ms |
| 👨‍💻 entriesFromBSON | `0.0110`ms | `0.0704` | `0.0077`ms | `0.0078`ms |
| 👨‍💻 BSONDocument.from | `0.0105`ms | `0.0148` | `0.0102`ms | `0.0101`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4819`ms | `0.0673` | `0.4759`ms | `0.4759`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - deep_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0788`ms | `0.0259` | `0.0783`ms | `0.0780`ms |
| 👨‍💻 entriesFromBSON | `0.0022`ms | `0.0046` | `0.0021`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.from | `0.0030`ms | `0.0048` | `0.0030`ms | `0.0029`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0080`ms | `0.0069` | `0.0078`ms | `0.0079`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - demo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0059`ms | `0.0045` | `0.0056`ms | `0.0059`ms |
| 👨‍💻 entriesFromBSON | `0.0018`ms | `0.0043` | `0.0017`ms | `0.0017`ms |
| 👨‍💻 BSONDocument.from | `0.0026`ms | `0.0029` | `0.0026`ms | `0.0025`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0063`ms | `0.0067` | `0.0059`ms | `0.0060`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flat_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1557`ms | `0.0538` | `0.1541`ms | `0.1539`ms |
| 👨‍💻 entriesFromBSON | `0.0682`ms | `0.0158` | `0.0680`ms | `0.0680`ms |
| 👨‍💻 BSONDocument.from | `0.0840`ms | `0.0178` | `0.0842`ms | `0.0839`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2827`ms | `0.0591` | `0.2845`ms | `0.2836`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flatadversarial

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0041`ms | `0.0009` | `0.0042`ms | `0.0041`ms |
| 👨‍💻 entriesFromBSON | `0.0019`ms | `0.0044` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0028`ms | `0.0038` | `0.0026`ms | `0.0026`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0101`ms | `0.0063` | `0.0093`ms | `0.0098`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - full_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1236`ms | `0.0608` | `0.1201`ms | `0.1199`ms |
| 👨‍💻 entriesFromBSON | `0.0433`ms | `0.0168` | `0.0403`ms | `0.0413`ms |
| 👨‍💻 BSONDocument.from | `0.0524`ms | `0.0139` | `0.0532`ms | `0.0510`ms |
| 👨‍💻 BSONDocument.toRecord | `0.3058`ms | `0.0506` | `0.2871`ms | `0.3083`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - github_events

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.9737`ms | `0.0569` | `0.9844`ms | `0.9844`ms |
| 👨‍💻 entriesFromBSON | `0.0095`ms | `0.0079` | `0.0088`ms | `0.0090`ms |
| 👨‍💻 BSONDocument.from | `0.0121`ms | `0.0075` | `0.0121`ms | `0.0120`ms |
| 👨‍💻 BSONDocument.toRecord | `0.1871`ms | `0.0249` | `0.1766`ms | `0.1896`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.4306`ms | `0.0344` | `0.4105`ms | `0.4368`ms |
| 👨‍💻 entriesFromBSON | `0.0038`ms | `0.0050` | `0.0036`ms | `0.0037`ms |
| 👨‍💻 BSONDocument.from | `0.0048`ms | `0.0052` | `0.0048`ms | `0.0048`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0412`ms | `0.0117` | `0.0388`ms | `0.0399`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.4342`ms | `0.0326` | `0.4404`ms | `0.4402`ms |
| 👨‍💻 entriesFromBSON | `0.0039`ms | `0.0054` | `0.0038`ms | `0.0038`ms |
| 👨‍💻 BSONDocument.from | `0.0048`ms | `0.0062` | `0.0045`ms | `0.0046`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0413`ms | `0.0112` | `0.0388`ms | `0.0414`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - gsoc-2018

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `25.6893`ms | `0.7177` | `25.6219`ms | `25.6815`ms |
| 👨‍💻 entriesFromBSON | `0.3976`ms | `0.0696` | `0.3994`ms | `0.3920`ms |
| 👨‍💻 BSONDocument.from | `0.4935`ms | `0.0797` | `0.4910`ms | `0.4868`ms |
| 👨‍💻 BSONDocument.toRecord | `7.8198`ms | `0.5065` | `7.5172`ms | `7.7239`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - instruments

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `3.3251`ms | `0.1486` | `3.4117`ms | `3.3361`ms |
| 👨‍💻 entriesFromBSON | `0.0056`ms | `0.0061` | `0.0056`ms | `0.0056`ms |
| 👨‍💻 BSONDocument.from | `0.0070`ms | `0.0071` | `0.0066`ms | `0.0067`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4113`ms | `0.0501` | `0.4097`ms | `0.4096`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - marine_ik

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `58.5744`ms | `10.4530` | `51.4789`ms | `53.8511`ms |
| 👨‍💻 entriesFromBSON | `0.0071`ms | `0.0723` | `0.0049`ms | `0.0050`ms |
| 👨‍💻 BSONDocument.from | `0.0060`ms | `0.0046` | `0.0058`ms | `0.0058`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0324`ms | `0.0152` | `0.0302`ms | `0.0322`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - mesh

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `11.7284`ms | `0.9882` | `10.9400`ms | `11.6612`ms |
| 👨‍💻 entriesFromBSON | `0.0048`ms | `0.0058` | `0.0049`ms | `0.0046`ms |
| 👨‍💻 BSONDocument.from | `0.0058`ms | `0.0067` | `0.0053`ms | `0.0054`ms |
| 👨‍💻 BSONDocument.toRecord | `117.3586`ms | `12.8471` | `121.2251`ms | `116.1310`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - mesh.pretty

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `11.9865`ms | `1.4758` | `11.7341`ms | `11.7775`ms |
| 👨‍💻 entriesFromBSON | `0.0074`ms | `0.0912` | `0.0049`ms | `0.0050`ms |
| 👨‍💻 BSONDocument.from | `0.0066`ms | `0.0092` | `0.0066`ms | `0.0065`ms |
| 👨‍💻 BSONDocument.toRecord | `126.5606`ms | `14.1892` | `124.7498`ms | `124.0612`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - numbers

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `3.3321`ms | `0.1562` | `3.4502`ms | `3.3304`ms |
| 👨‍💻 entriesFromBSON | `3.5739`ms | `0.5554` | `3.3405`ms | `3.3439`ms |
| 👨‍💻 BSONDocument.from | `5.9846`ms | `2.7768` | `4.7720`ms | `4.7612`ms |
| 👨‍💻 BSONDocument.toRecord | `10.6522`ms | `0.9082` | `10.9629`ms | `10.6954`ms |

Fastest: 🍃 BSON.deserialize

### Results - random

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `13.8419`ms | `1.1887` | `15.0647`ms | `13.8254`ms |
| 👨‍💻 entriesFromBSON | `0.0061`ms | `0.0431` | `0.0031`ms | `0.0031`ms |
| 👨‍💻 BSONDocument.from | `0.0050`ms | `0.0170` | `0.0044`ms | `0.0044`ms |
| 👨‍💻 BSONDocument.toRecord | `1.1150`ms | `0.1319` | `1.0992`ms | `1.1010`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - repeat

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1539`ms | `0.0193` | `0.1563`ms | `0.1565`ms |
| 👨‍💻 entriesFromBSON | `0.0032`ms | `0.0043` | `0.0031`ms | `0.0031`ms |
| 👨‍💻 BSONDocument.from | `0.0044`ms | `0.0057` | `0.0043`ms | `0.0043`ms |
| 👨‍💻 BSONDocument.toRecord | `0.1160`ms | `0.0248` | `0.1131`ms | `0.1133`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - truenull

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.6956`ms | `0.0311` | `0.6902`ms | `0.6913`ms |
| 👨‍💻 entriesFromBSON | `0.6379`ms | `0.0788` | `0.6194`ms | `0.6206`ms |
| 👨‍💻 BSONDocument.from | `0.7693`ms | `0.1020` | `0.7439`ms | `0.7485`ms |
| 👨‍💻 BSONDocument.toRecord | `1.7059`ms | `0.1535` | `1.8600`ms | `1.7211`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `10.5076`ms | `0.9640` | `10.6946`ms | `10.5030`ms |
| 👨‍💻 entriesFromBSON | `0.0047`ms | `0.0224` | `0.0023`ms | `0.0025`ms |
| 👨‍💻 BSONDocument.from | `0.0035`ms | `0.0129` | `0.0028`ms | `0.0032`ms |
| 👨‍💻 BSONDocument.toRecord | `0.1058`ms | `0.0331` | `0.1080`ms | `0.1078`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - twitter_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2073`ms | `0.0325` | `0.1929`ms | `0.2058`ms |
| 👨‍💻 entriesFromBSON | `0.0016`ms | `0.0050` | `0.0017`ms | `0.0016`ms |
| 👨‍💻 BSONDocument.from | `0.0024`ms | `0.0039` | `0.0023`ms | `0.0023`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0269`ms | `0.0123` | `0.0265`ms | `0.0264`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2622`ms | `0.0310` | `0.2567`ms | `0.2581`ms |
| 👨‍💻 entriesFromBSON | `0.0017`ms | `0.0046` | `0.0017`ms | `0.0017`ms |
| 👨‍💻 BSONDocument.from | `0.0025`ms | `0.0043` | `0.0023`ms | `0.0024`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0394`ms | `0.0130` | `0.0404`ms | `0.0394`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_timeline

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.9754`ms | `0.0863` | `1.0255`ms | `0.9841`ms |
| 👨‍💻 entriesFromBSON | `0.0064`ms | `0.0078` | `0.0060`ms | `0.0061`ms |
| 👨‍💻 BSONDocument.from | `0.0091`ms | `0.0104` | `0.0087`ms | `0.0087`ms |
| 👨‍💻 BSONDocument.toRecord | `0.3700`ms | `0.2088` | `0.3265`ms | `0.3274`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitterescaped

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `12.0489`ms | `0.8674` | `11.6827`ms | `11.7132`ms |
| 👨‍💻 entriesFromBSON | `0.0027`ms | `0.0057` | `0.0026`ms | `0.0026`ms |
| 👨‍💻 BSONDocument.from | `0.0032`ms | `0.0034` | `0.0028`ms | `0.0032`ms |
| 👨‍💻 BSONDocument.toRecord | `0.1203`ms | `0.0280` | `0.1169`ms | `0.1172`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - update-center

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `13.9213`ms | `1.4145` | `13.3381`ms | `13.5794`ms |
| 👨‍💻 entriesFromBSON | `0.0050`ms | `0.0078` | `0.0048`ms | `0.0048`ms |
| 👨‍💻 BSONDocument.from | `0.0061`ms | `0.0077` | `0.0059`ms | `0.0059`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4905`ms | `0.0838` | `0.4933`ms | `0.4938`ms |

Fastest: 👨‍💻 entriesFromBSON
