# BSON Bench

## Hardware
- cpu: Intel(R) Xeon(R) CPU E5-2673 v3 @ 2.40GHz
- cores: 2
- os: linux
- ram: 6.783607482910156GB
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
| 🍃 BSON.deserialize | `0.0045`ms | `0.0403` | `0.0023`ms | `0.0025`ms |
| 👨‍💻 entriesFromBSON | `0.0022`ms | `0.0103` | `0.0016`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0037`ms | `0.0211` | `0.0027`ms | `0.0027`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0143`ms | `0.0443` | `0.0098`ms | `0.0101`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - apache_builds

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `2.0627`ms | `0.3238` | `1.8436`ms | `2.0076`ms |
| 👨‍💻 entriesFromBSON | `0.0125`ms | `0.1155` | `0.0092`ms | `0.0093`ms |
| 👨‍💻 BSONDocument.from | `0.0150`ms | `0.1321` | `0.0107`ms | `0.0109`ms |
| 👨‍💻 BSONDocument.toRecord | `2.1852`ms | `0.3848` | `1.9420`ms | `2.1057`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - blns

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2861`ms | `0.0923` | `0.2539`ms | `0.2718`ms |
| 👨‍💻 entriesFromBSON | `0.0015`ms | `0.0048` | `0.0014`ms | `0.0014`ms |
| 👨‍💻 BSONDocument.from | `0.0023`ms | `0.0057` | `0.0021`ms | `0.0022`ms |
| 👨‍💻 BSONDocument.toRecord | `1.2269`ms | `0.2192` | `1.1262`ms | `1.1578`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - canada

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `49.3704`ms | `9.7225` | `43.6198`ms | `46.5118`ms |
| 👨‍💻 entriesFromBSON | `0.0031`ms | `0.0590` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0028`ms | `0.0055` | `0.0026`ms | `0.0026`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0100`ms | `0.0073` | `0.0092`ms | `0.0093`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - che-1.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2746`ms | `0.0826` | `0.2478`ms | `0.2524`ms |
| 👨‍💻 entriesFromBSON | `0.0019`ms | `0.0017` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0027`ms | `0.0032` | `0.0026`ms | `0.0026`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0100`ms | `0.0075` | `0.0092`ms | `0.0093`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-2.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2777`ms | `0.0934` | `0.2496`ms | `0.2538`ms |
| 👨‍💻 entriesFromBSON | `0.0019`ms | `0.0012` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0030`ms | `0.0107` | `0.0026`ms | `0.0027`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0108`ms | `0.0118` | `0.0092`ms | `0.0097`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-3.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2753`ms | `0.1460` | `0.2485`ms | `0.2507`ms |
| 👨‍💻 entriesFromBSON | `0.0020`ms | `0.0050` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0027`ms | `0.0036` | `0.0026`ms | `0.0026`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0100`ms | `0.0126` | `0.0092`ms | `0.0093`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - citm_catalog

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `15.1724`ms | `1.1464` | `14.1811`ms | `14.8703`ms |
| 👨‍💻 entriesFromBSON | `0.0124`ms | `0.0735` | `0.0067`ms | `0.0074`ms |
| 👨‍💻 BSONDocument.from | `0.0094`ms | `0.0076` | `0.0082`ms | `0.0083`ms |
| 👨‍💻 BSONDocument.toRecord | `0.7876`ms | `0.1615` | `0.7268`ms | `0.7351`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - deep_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0715`ms | `0.0953` | `0.0675`ms | `0.0675`ms |
| 👨‍💻 entriesFromBSON | `0.0019`ms | `0.0014` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from | `0.0027`ms | `0.0045` | `0.0025`ms | `0.0025`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0101`ms | `0.0137` | `0.0092`ms | `0.0093`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - demo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0062`ms | `0.0090` | `0.0053`ms | `0.0056`ms |
| 👨‍💻 entriesFromBSON | `0.0015`ms | `0.0009` | `0.0015`ms | `0.0014`ms |
| 👨‍💻 BSONDocument.from | `0.0024`ms | `0.0044` | `0.0022`ms | `0.0022`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0075`ms | `0.0070` | `0.0068`ms | `0.0069`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flat_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1435`ms | `0.0965` | `0.1285`ms | `0.1306`ms |
| 👨‍💻 entriesFromBSON | `0.0626`ms | `0.0251` | `0.0568`ms | `0.0580`ms |
| 👨‍💻 BSONDocument.from | `0.0796`ms | `0.0305` | `0.0725`ms | `0.0740`ms |
| 👨‍💻 BSONDocument.toRecord | `0.4463`ms | `0.1046` | `0.4051`ms | `0.4149`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flatadversarial

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0040`ms | `0.0095` | `0.0036`ms | `0.0036`ms |
| 👨‍💻 entriesFromBSON | `0.0018`ms | `0.0042` | `0.0016`ms | `0.0016`ms |
| 👨‍💻 BSONDocument.from | `0.0027`ms | `0.0104` | `0.0024`ms | `0.0024`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0184`ms | `0.0190` | `0.0167`ms | `0.0169`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - full_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1276`ms | `0.0653` | `0.1139`ms | `0.1151`ms |
| 👨‍💻 entriesFromBSON | `0.0391`ms | `0.0168` | `0.0359`ms | `0.0362`ms |
| 👨‍💻 BSONDocument.from | `0.0490`ms | `0.0224` | `0.0446`ms | `0.0456`ms |
| 👨‍💻 BSONDocument.toRecord | `0.5241`ms | `0.1208` | `0.4770`ms | `0.4875`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - github_events

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.9006`ms | `0.1564` | `0.8357`ms | `0.8533`ms |
| 👨‍💻 entriesFromBSON | `0.0088`ms | `0.0094` | `0.0078`ms | `0.0080`ms |
| 👨‍💻 BSONDocument.from | `0.0113`ms | `0.0100` | `0.0099`ms | `0.0101`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2237`ms | `0.0710` | `0.2041`ms | `0.2055`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.4268`ms | `0.1520` | `0.3994`ms | `0.4020`ms |
| 👨‍💻 entriesFromBSON | `0.0033`ms | `0.0042` | `0.0030`ms | `0.0031`ms |
| 👨‍💻 BSONDocument.from | `0.0045`ms | `0.0063` | `0.0041`ms | `0.0042`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0820`ms | `0.0311` | `0.0762`ms | `0.0768`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.4188`ms | `0.1032` | `0.3979`ms | `0.3986`ms |
| 👨‍💻 entriesFromBSON | `0.0034`ms | `0.0060` | `0.0030`ms | `0.0031`ms |
| 👨‍💻 BSONDocument.from | `0.0046`ms | `0.0131` | `0.0038`ms | `0.0040`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0823`ms | `0.0316` | `0.0762`ms | `0.0768`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - gsoc-2018

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `20.8088`ms | `1.1797` | `20.3698`ms | `20.4806`ms |
| 👨‍💻 entriesFromBSON | `0.4198`ms | `0.1408` | `0.3849`ms | `0.3867`ms |
| 👨‍💻 BSONDocument.from | `0.5096`ms | `0.1524` | `0.4607`ms | `0.4668`ms |
| 👨‍💻 BSONDocument.toRecord | `8.9842`ms | `0.7599` | `8.3954`ms | `8.8260`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - instruments

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `3.4288`ms | `0.4023` | `3.2232`ms | `3.3336`ms |
| 👨‍💻 entriesFromBSON | `0.0068`ms | `0.0215` | `0.0046`ms | `0.0047`ms |
| 👨‍💻 BSONDocument.from | `0.0072`ms | `0.0214` | `0.0059`ms | `0.0063`ms |
| 👨‍💻 BSONDocument.toRecord | `0.8904`ms | `0.1905` | `0.8198`ms | `0.8333`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - marine_ik

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `58.6591`ms | `6.9497` | `59.4629`ms | `56.5159`ms |
| 👨‍💻 entriesFromBSON | `0.0067`ms | `0.1279` | `0.0041`ms | `0.0042`ms |
| 👨‍💻 BSONDocument.from | `0.0058`ms | `0.0111` | `0.0052`ms | `0.0053`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0475`ms | `0.0455` | `0.0411`ms | `0.0422`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - mesh

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `11.7130`ms | `1.0075` | `10.8215`ms | `11.5088`ms |
| 👨‍💻 entriesFromBSON | `0.0066`ms | `0.0674` | `0.0044`ms | `0.0047`ms |
| 👨‍💻 BSONDocument.from | `0.0062`ms | `0.0179` | `0.0055`ms | `0.0055`ms |
| 👨‍💻 BSONDocument.toRecord | `202.4399`ms | `10.8744` | `195.4540`ms | `200.5616`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - mesh.pretty

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `11.7061`ms | `1.0511` | `11.9633`ms | `11.4981`ms |
| 👨‍💻 entriesFromBSON | `0.0056`ms | `0.0555` | `0.0044`ms | `0.0045`ms |
| 👨‍💻 BSONDocument.from | `0.0061`ms | `0.0074` | `0.0055`ms | `0.0056`ms |
| 👨‍💻 BSONDocument.toRecord | `202.1182`ms | `10.3728` | `208.3621`ms | `200.0999`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - numbers

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `3.1720`ms | `0.4348` | `2.9070`ms | `3.0706`ms |
| 👨‍💻 entriesFromBSON | `3.2806`ms | `0.5485` | `2.8632`ms | `3.0721`ms |
| 👨‍💻 BSONDocument.from | `5.3710`ms | `2.2038` | `3.9741`ms | `4.4151`ms |
| 👨‍💻 BSONDocument.toRecord | `23.5712`ms | `1.3621` | `23.3848`ms | `23.1892`ms |

Fastest: 🍃 BSON.deserialize

### Results - random

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `14.6488`ms | `0.9109` | `13.9800`ms | `14.3726`ms |
| 👨‍💻 entriesFromBSON | `0.0051`ms | `0.0597` | `0.0024`ms | `0.0027`ms |
| 👨‍💻 BSONDocument.from | `0.0043`ms | `0.0283` | `0.0033`ms | `0.0035`ms |
| 👨‍💻 BSONDocument.toRecord | `2.3171`ms | `0.2997` | `2.1292`ms | `2.2464`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - repeat

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.1492`ms | `0.0588` | `0.1329`ms | `0.1407`ms |
| 👨‍💻 entriesFromBSON | `0.0027`ms | `0.0052` | `0.0024`ms | `0.0025`ms |
| 👨‍💻 BSONDocument.from | `0.0035`ms | `0.0052` | `0.0032`ms | `0.0033`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2401`ms | `0.0875` | `0.2229`ms | `0.2247`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - truenull

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.6196`ms | `0.1181` | `0.5759`ms | `0.5823`ms |
| 👨‍💻 entriesFromBSON | `0.5755`ms | `0.1321` | `0.5176`ms | `0.5332`ms |
| 👨‍💻 BSONDocument.from | `0.7067`ms | `0.1713` | `0.6379`ms | `0.6512`ms |
| 👨‍💻 BSONDocument.toRecord | `4.3201`ms | `0.4726` | `3.9750`ms | `4.1960`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `11.2584`ms | `0.8315` | `11.1364`ms | `10.9892`ms |
| 👨‍💻 entriesFromBSON | `0.0035`ms | `0.0725` | `0.0021`ms | `0.0022`ms |
| 👨‍💻 BSONDocument.from | `0.0034`ms | `0.0184` | `0.0029`ms | `0.0029`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2499`ms | `0.0785` | `0.2306`ms | `0.2316`ms |

Fastest: 👨‍💻 BSONDocument.from

### Results - twitter_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2296`ms | `0.0722` | `0.2119`ms | `0.2129`ms |
| 👨‍💻 entriesFromBSON | `0.0018`ms | `0.0064` | `0.0016`ms | `0.0016`ms |
| 👨‍💻 BSONDocument.from | `0.0027`ms | `0.0069` | `0.0022`ms | `0.0023`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0285`ms | `0.0198` | `0.0263`ms | `0.0265`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2690`ms | `0.0766` | `0.2486`ms | `0.2501`ms |
| 👨‍💻 entriesFromBSON | `0.0017`ms | `0.0014` | `0.0015`ms | `0.0015`ms |
| 👨‍💻 BSONDocument.from | `0.0026`ms | `0.0071` | `0.0022`ms | `0.0023`ms |
| 👨‍💻 BSONDocument.toRecord | `0.0425`ms | `0.0258` | `0.0378`ms | `0.0388`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitter_timeline

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `1.0170`ms | `0.2016` | `0.9293`ms | `0.9512`ms |
| 👨‍💻 entriesFromBSON | `0.0064`ms | `0.0106` | `0.0059`ms | `0.0059`ms |
| 👨‍💻 BSONDocument.from | `0.0080`ms | `0.0077` | `0.0072`ms | `0.0073`ms |
| 👨‍💻 BSONDocument.toRecord | `0.3393`ms | `0.1054` | `0.3036`ms | `0.3174`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - twitterescaped

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `11.5144`ms | `0.9375` | `11.0155`ms | `11.1946`ms |
| 👨‍💻 entriesFromBSON | `0.0023`ms | `0.0031` | `0.0021`ms | `0.0021`ms |
| 👨‍💻 BSONDocument.from | `0.0030`ms | `0.0037` | `0.0029`ms | `0.0029`ms |
| 👨‍💻 BSONDocument.toRecord | `0.2470`ms | `0.0772` | `0.2303`ms | `0.2306`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - update-center

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `12.4128`ms | `0.9256` | `11.7754`ms | `12.1311`ms |
| 👨‍💻 entriesFromBSON | `0.0046`ms | `0.0066` | `0.0038`ms | `0.0040`ms |
| 👨‍💻 BSONDocument.from | `0.0054`ms | `0.0073` | `0.0049`ms | `0.0049`ms |
| 👨‍💻 BSONDocument.toRecord | `0.5037`ms | `0.1166` | `0.4637`ms | `0.4672`ms |

Fastest: 👨‍💻 entriesFromBSON
